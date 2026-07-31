import { UnstyledButton, Checkbox, Text, Image } from "@mantine/core";
import { useUncontrolled } from "@mantine/hooks";
import classes from "./checkboxSelectImage.module.css";

interface ImageCheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?(checked: boolean): void;
  title: string;
  image?: string;
}

export function ImageCheckbox({
  checked,
  defaultChecked,
  onChange,
  title,
  className,
  image,
  ...others
}: ImageCheckboxProps &
  Omit<React.ComponentPropsWithoutRef<"button">, keyof ImageCheckboxProps>) {
  const [value, handleChange] = useUncontrolled({
    value: checked,
    defaultValue: defaultChecked,
    finalValue: false,
    onChange,
  });

  return (
    <UnstyledButton
      {...others}
      onClick={() => handleChange(!value)}
      data-checked={value || undefined}
      className={classes.button}
    >
      <div className={classes.body}>
        <Text fw={500} size="sm" lh={1}>
          {title}
        </Text>
      </div>

      <Checkbox
        checked={value}
        onChange={(event) => handleChange(event.currentTarget.checked)}
        tabIndex={-1}
        styles={{ input: { cursor: "pointer" } }}
      />
    </UnstyledButton>
  );
}
