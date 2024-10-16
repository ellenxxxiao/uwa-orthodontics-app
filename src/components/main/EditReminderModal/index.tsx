"use client";

import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReminderType, RepeatType, Role, User } from "@prisma/client";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/clerk-react";
import CustomField from "@/components/main/CustomField";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog-custom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TimePickerInput } from "@/components/ui/time-picker-input";
import type { ReminderItem } from "@/types/reminder";

const reminderFormSchema = z.object({
  patient: z.string(),
  repeatType: z.nativeEnum(RepeatType),
  reminderType: z.nativeEnum(ReminderType),
  startDate: z.date(),
  time: z.date(),
  description: z.string().optional(),
  endDate: z.date().optional()
});

const repeatTypes = [
  { value: RepeatType.NEVER, label: "Never" },
  { value: RepeatType.DAILY, label: "Every Day" },
  { value: RepeatType.WEEKLY, label: "Every Week" },
  { value: RepeatType.FORTNIGHTLY, label: "Every Fortnight" },
  { value: RepeatType.MONTHLY, label: "Every Month" },
  { value: RepeatType.YEARLY, label: "Every Year" },
  { value: RepeatType.CUSTOM, label: "Custom" }
];

const reminderTypes = [
  { value: ReminderType.ALIGNER, label: "Aligner" },
  { value: ReminderType.APPOINTMENT, label: "Appointment" },
  { value: ReminderType.OTHER, label: "Other" }
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  reminder: ReminderItem | null;
  action: "create" | "update";
}

export default function EditProfileModal({
  isOpen,
  onClose,
  reminder,
  action
}: Props) {
  const { isSignedIn, user, isLoaded } = useUser();
  const minuteRef = useRef<HTMLInputElement>(null);
  const hourRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [patients, setPatients] = useState<{ value: string; label: string }[]>(
    []
  );

  const reminderForm = useForm<z.infer<typeof reminderFormSchema>>({
    resolver: zodResolver(reminderFormSchema),
    defaultValues: {
      repeatType: RepeatType.NEVER
    }
  });

  const { reset, setValue, getValues } = reminderForm;

  useEffect(() => {
    if (action === "update" && reminder) {
      // Reset the form values with the provided reminder data for update action
      reset({
        patient: reminder.patientId,
        repeatType: reminder.repeatType || RepeatType.NEVER,
        reminderType: reminder.reminderType,
        startDate: new Date(reminder.startDate),
        time: new Date(reminder.startDate), // Assuming time is embedded in startDate
        description: reminder.description || "",
        endDate: reminder.endDate ? new Date(reminder.endDate) : undefined
      });
    } else if (action === "create") {
      // Clear all fields for create action
      reset({
        patient: "",
        repeatType: RepeatType.NEVER,
        reminderType: ReminderType.ALIGNER, // Default type
        startDate: undefined,
        time: undefined,
        description: "",
        endDate: undefined
      });
    }
  }, [reminder, reset, action]);

  const selectedTime = useWatch({
    control: reminderForm.control,
    name: "time"
  });

  // Fetch user data from the API endpoint
  useEffect(() => {
    async function fetchPatients() {
      try {
        const response = await fetch("/api/users"); // Adjust the endpoint as needed
        const data: User[] = await response.json();

        // Map the user data to fit the CustomField options format
        const patientOptions = data
          .filter((user) => user.role === Role.PATIENT) // Filter for patients only
          .map((user) => ({
            value: user.id,
            label: `${user.firstName} ${user.lastName}`
          }));

        setPatients(patientOptions);
      } catch (error) {
        console.error("Failed to fetch patients:", error);
      }
    }

    fetchPatients();
  }, []);

  useEffect(() => {
    if (selectedTime) {
      const currentStartDate = getValues("startDate");
      const currentEndDate = getValues("endDate");

      // Function to merge the date with the selected time
      const setDateWithTime = (date: Date, time: Date) => {
        const newDate = new Date(date);
        newDate.setHours(time.getHours());
        newDate.setMinutes(time.getMinutes());
        return newDate;
      };

      // Update startDate with selected time
      setValue("startDate", setDateWithTime(currentStartDate, selectedTime));

      // If endDate exists, update endDate with selected time
      if (currentEndDate) {
        setValue("endDate", setDateWithTime(currentEndDate, selectedTime));
      }
    }
  }, [selectedTime, getValues, setValue]);

  const selectedRepeat = useWatch({
    control: reminderForm.control,
    name: "repeatType"
  });

  const onSubmit = async (values: z.infer<typeof reminderFormSchema>) => {
    const { time, ...formValuesWithoutTime } = values;
    const url =
      action === "create"
        ? `/api/reminder`
        : `/api/reminder/${reminder?.reminderId}`;
    const method = action === "create" ? "POST" : "PATCH";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formValuesWithoutTime,
          ...(action === "create"
            ? {
                setById: user!.id,
                setForId: formValuesWithoutTime.patient,
                scheduledAt: formValuesWithoutTime.startDate
              }
            : {})
        })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description:
            action === "create"
              ? "Reminder created successfully"
              : "Reminder updated successfully"
        });
      } else {
        throw new Error("Failed to process the request.");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          action === "create"
            ? "Failed to create reminder"
            : "Failed to update reminder"
      });
    } finally {
      reminderForm.reset();
      onClose();
    }
  };

  // Function to handle delete confirmation
  const handleDeleteReminder = async () => {
    try {
      const response = await fetch(`/api/reminder/${reminder?.reminderId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Reminder deleted successfully"
        });
        // onDeleteReminder(reminder?.reminderId); // Call the prop function to update state in parent component
        onClose(); // Close the modal after deletion
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete reminder"
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete reminder"
      });
    }
  };

  useEffect(() => {
    // Reset confirmation dialog state when the modal is opened
    if (isOpen) {
      setIsConfirmDeleteOpen(false);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:max-5xl:5/6 md:max-5xl:px-10 md:max-5xl:py-8 w-11/12 max-w-[900px] rounded-lg p-4">
        <DialogHeader>
          <DialogTitle className="md:max-5xl:text-3xl md:max-5xl:font-bold my-2 ml-2 text-left text-xl">
            Edit Reminder
          </DialogTitle>
          <div className="border-t border-base-300"></div>
        </DialogHeader>

        {/* FORM SECTION */}

        {/* Edit Profile Form */}
        <Form {...reminderForm}>
          <form
            onSubmit={reminderForm.handleSubmit(onSubmit)}
            className="md:max-5xl:w-2/3 mx-auto mt-4 w-11/12 space-y-6"
          >
            {/* Patient dropdown with search */}
            <CustomField
              control={reminderForm.control}
              name="patient"
              label="Patient"
              placeholder="Select a patient"
              options={patients}
            />

            {/* Repeat type*/}
            <CustomField
              control={reminderForm.control}
              name="repeatType"
              label="repeatType"
              placeholder="Never"
              options={repeatTypes}
            />

            {/* Start date picker */}
            <CustomField
              control={reminderForm.control}
              name="startDate"
              label="Starts"
              placeholder="Select"
              isDatePicker
            />

            {/* Conditionally render the end date field */}
            {selectedRepeat !== RepeatType.NEVER && (
              <CustomField
                control={reminderForm.control}
                name="endDate"
                label="Ends"
                placeholder="Select"
                isDatePicker
              />
            )}

            {/* Time picker */}
            <FormField
              control={reminderForm.control}
              name="time"
              render={({ field }) => (
                <FormItem className="flex flex-row justify-between">
                  <FormLabel className="w-22 lg:max-5xl:min-w-40 lg:max-5xl:text-lg mt-2 self-center px-2 py-2 align-baseline text-base font-bold">
                    Time
                  </FormLabel>
                  <div className="lg:max-5xl:w-full flex justify-start">
                    <FormControl>
                      <div className="flex items-end gap-2">
                        <div className="grid gap-1 text-center">
                          <Label htmlFor="hours" className="text-xs">
                            Hours
                          </Label>
                          <TimePickerInput
                            picker="hours"
                            date={field.value}
                            setDate={field.onChange}
                            ref={hourRef}
                            onRightFocus={() => minuteRef.current?.focus()}
                          />
                        </div>
                        <div className="grid gap-1 text-center">
                          <Label htmlFor="minutes" className="text-xs">
                            Minutes
                          </Label>
                          <TimePickerInput
                            picker="minutes"
                            date={field.value}
                            setDate={field.onChange}
                            ref={minuteRef}
                            onLeftFocus={() => hourRef.current?.focus()}
                          />
                        </div>
                      </div>
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

            {/* Reminder Type */}
            <CustomField
              control={reminderForm.control}
              name="reminderType"
              label="Type"
              placeholder="Select"
              options={reminderTypes}
            />

            {/* Description */}
            <FormField
              control={reminderForm.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="w-22 lg:max-5xl:min-w-40 lg:max-5xl:text-lg mt-2 p-2 align-baseline text-base font-bold">
                    Description
                  </FormLabel>
                  <Textarea
                    {...field}
                    placeholder="Add a description"
                    className="w-22 ml-2"
                  />
                  {/* <FormMessage /> */}
                </FormItem>
              )}
            />

            <DialogFooter />

            <div className="absolute -top-1 right-6">
              <Button
                className="h-10 w-10 px-2 text-xl font-bold text-primary"
                variant="ghost"
                type="submit"
              >
                {action === "create" ? "Add" : "Done"}
              </Button>
            </div>
          </form>
        </Form>

        {/* Confirmation Dialog */}
        {isConfirmDeleteOpen && (
          <Dialog
            open={isConfirmDeleteOpen}
            onOpenChange={() => setIsConfirmDeleteOpen(false)}
          >
            <DialogContent className="h-72 w-96 rounded-xl p-12">
              <DialogHeader>
                <DialogTitle className="text-xl">Confirm Deletion</DialogTitle>
                <p className="text-lg">
                  Are you sure you want to delete this reminder?
                </p>
              </DialogHeader>
              <DialogFooter className="mx-auto">
                <Button
                  className="mt-2 w-32 text-lg"
                  variant="outline"
                  onClick={() => setIsConfirmDeleteOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="w-32 text-lg"
                  variant="destructive"
                  onClick={handleDeleteReminder}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {action === "update" && (
          <div className="mx-auto ">
            <Button
              className="h-10 w-20 px-2 text-xl font-bold"
              variant="destructive"
              onClick={() => setIsConfirmDeleteOpen(true)}
            >
              Delete
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
