import React from 'react';

interface ColorInputProps {
  label?: string,
  id?: string,
  onColorChange: (event: React.FormEvent<HTMLInputElement>) => void
}

export const ColorInput: React.FC<ColorInputProps> = ({label, id, onColorChange}: ColorInputProps) => {
  const colorPicker = React.useRef<HTMLInputElement>(null);
  const [background, setBackground] = React.useState<string>(colorPicker.current?.value || 'black');

  const clickColorInput = () => {
    if (colorPicker.current) {
      colorPicker.current.click();
    }
  }

  const colorChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
    if (colorPicker.current) {
      setBackground(event.currentTarget.value);
      onColorChange(event);
    }
  }
  return (
    <>
      {label && <label htmlFor={id} style={{marginRight: 10}}>{label}</label>}
      <input type="color" ref={colorPicker} onChange={colorChangeHandler} id={id || undefined} hidden/>
      <div className="toolbar__colorPicker" style={{backgroundColor: background}} onClick={clickColorInput} title="Fill color"></div>
    </>
  )
}