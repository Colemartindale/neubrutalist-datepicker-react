export interface DatePickerProps {
  selected?: Date;
  onChange?: (date: Date) => void;
  onSelect?: (date: Date) => void;
}
