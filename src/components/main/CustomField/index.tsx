import { useState } from "react";
import { format, startOfDay } from "date-fns";
import { CalendarIcon, Check, ChevronDown } from "lucide-react";
import { Control } from "react-hook-form";

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
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface CustomFieldProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder: string;
  options?: { value: string; label: string }[];
  isDatePicker?: boolean; // Determines if it's a date picker or dropdown
}

// Combined FormField component
export default function CustomField({
  control,
  name,
  label,
  placeholder,
  options,
  isDatePicker = false
}: CustomFieldProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row justify-between gap-x-4">
          <FormLabel className="w-22 lg:max-5xl:min-w-40 lg:max-5xl:text-lg mt-2 px-2 py-2 align-baseline text-base font-bold">
            {label}
          </FormLabel>
          <div className="lg:max-5xl:w-full flex justify-start">
            {isDatePicker ? (
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-44 pl-3 text-left font-normal md:w-56",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PP")
                      ) : (
                        <span>{placeholder}</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(e) => {
                      field.onChange(e);
                      setIsCalendarOpen(false);
                    }}
                    fromDate={startOfDay(new Date())}
                    showOutsideDays={true}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            ) : (
              <Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={dropdownOpen}
                      className="lg:max-5xl:rounded-lg lg:max-5xl:text-base flex w-44 flex-row justify-between space-x-6 pl-4 pr-2 md:w-56"
                    >
                      <span>
                        {field.value
                          ? options?.find(
                              (option) => option.value === field.value
                            )?.label
                          : placeholder}
                      </span>
                      <ChevronDown className="h-6 w-6 pr-1 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>

                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder={`Search ${label.toLowerCase()}...`}
                    />
                    <CommandList>
                      <CommandEmpty>
                        No {label.toLowerCase()} found.
                      </CommandEmpty>
                      <CommandGroup>
                        {options?.map((option) => (
                          <CommandItem
                            value={option.label}
                            key={option.value}
                            onSelect={() => {
                              field.onChange(option.value);
                              setDropdownOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                option.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {option.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
          </div>
          {/* <FormMessage /> */}
        </FormItem>
      )}
    />
  );
}
