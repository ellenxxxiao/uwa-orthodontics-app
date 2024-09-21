"use client";

import { useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReminderType, RepeatType } from "@prisma/client";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import CustomField from "@/components/CustomField";
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

const reminderFormSchema = z.object({
  patient: z.string(),
  repeat: z.nativeEnum(RepeatType),
  reminderType: z.nativeEnum(ReminderType),
  startDate: z.date(),
  time: z.date(),
  description: z.string().optional(),
  endDate: z.date().optional()
});

// FIXME: Mock data
const patients = [
  { value: "1", label: "Runtian Liang" },
  { value: "2", label: "Zimu Zhang" },
  { value: "3", label: "Alian Haidar" }
];

const repeatTypes = [
  { value: RepeatType.NEVER, label: "Never" },
  { value: RepeatType.DAILY, label: "Every Day" },
  { value: RepeatType.WEEKLY, label: "Every Week" },
  { value: RepeatType.FORNIGHTLY, label: "Every Fortnight" },
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
}

export default function EditProfileModal({ isOpen, onClose }: Props) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const minuteRef = useRef<HTMLInputElement>(null);
  const hourRef = useRef<HTMLInputElement>(null);

  const reminderForm = useForm<z.infer<typeof reminderFormSchema>>({
    resolver: zodResolver(reminderFormSchema),
    defaultValues: {
      repeat: RepeatType.NEVER
    }
  });

  const selectedRepeat = useWatch({
    control: reminderForm.control,
    name: "repeat"
  });

  function onSubmit(values: z.infer<typeof reminderFormSchema>) {
    console.log(values);
    reminderForm.reset();
    onClose();
  }

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
              name="repeat"
              label="Repeat"
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

            <DialogFooter className="py-1" />

            <div className="absolute -top-1 right-6">
              <Button
                className="h-10 w-10 px-2 text-xl font-bold text-primary"
                variant="ghost"
                type="submit"
              >
                Add
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
