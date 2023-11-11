import { Editable, EditableInput, EditablePreview } from '@chakra-ui/react';
import { ChangeEventHandler } from 'react';

interface Props {
  title?: string;
  handleTitleChange: ChangeEventHandler<HTMLInputElement>;
  color?: string;
  [key: string]: any;
}

export default function TitleEditor({
  title,
  handleTitleChange,
  color,
  ...props
}: Props) {
  color = color || 'gray.700';

  return (
    <Editable
      w="100%"
      className="text-lg sm:text-3xl"
      color={color}
      defaultValue={title}
      {...props}
    >
      <EditablePreview />
      <EditableInput onChange={handleTitleChange} />
    </Editable>
  );
}
