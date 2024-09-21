"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronDown, CalendarIcon } from "lucide-react";
import { useState } from "react";
import { Control, useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { ReminderType, RepeatType } from "@prisma/client";

import CustomField from "@/components/CustomField";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog-custom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// enum RepeatType {
//   NEVER = "Never",
//   DAILY = "Every Day",
//   WEEKLY = "Every Week",
//   FORNIGHTLY = "Every Fortnight",
//   MONTHLY = "Every Month",
//   YEARLY = "Every Year",
//   CUSTOM = "Custom"
// }

const reminderFormSchema = z.object({
  patient: z.string(),
  repeat: z.nativeEnum(RepeatType),
  reminderType: z.nativeEnum(ReminderType),
  startDate: z.date()
  // endDate: z.date()
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
  const reminderForm = useForm<z.infer<typeof reminderFormSchema>>({
    resolver: zodResolver(reminderFormSchema),
    defaultValues: {}
  });

  function onSubmit(values: z.infer<typeof reminderFormSchema>) {
    console.log(values);
    // Reset with empty values or specific defaults
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
            className="md:max-5xl:w-2/3 mx-auto mt-4 space-y-6"
          >
            <CustomField
              control={reminderForm.control}
              name="patient"
              label="Patient"
              placeholder="Select a patient"
              options={patients}
            />

            <CustomField
              control={reminderForm.control}
              name="repeat"
              label="Repeat"
              placeholder="Never"
              options={repeatTypes}
            />

            <CustomField
              control={reminderForm.control}
              name="startDate"
              label="Starts"
              placeholder="Select"
              isDatePicker
            />

            <CustomField
              control={reminderForm.control}
              name="reminderType"
              label="Type"
              placeholder="Select"
              options={reminderTypes}
            />

            <DialogFooter />

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
