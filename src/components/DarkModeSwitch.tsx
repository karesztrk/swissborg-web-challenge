import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import {
  useColorMode,
  Switch,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';

export const DarkModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === 'dark';
  const icon = useColorModeValue(<MoonIcon />, <SunIcon />);
  return (
    <IconButton
      aria-label='Dark mode'
      position='fixed'
      top='1rem'
      right='1rem'
      isChecked={isDark}
      onClick={toggleColorMode}
      icon={icon}
    ></IconButton>
  );
};
