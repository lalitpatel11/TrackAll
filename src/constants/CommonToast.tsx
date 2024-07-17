// external imports
import {Box, useToast} from 'native-base';
import React, {forwardRef, useImperativeHandle} from 'react';

const CommonToast = forwardRef((props, ref) => {
  const toast = useToast();
  useImperativeHandle(ref, () => ({
    getToast(message: string, type: string) {
      const id = message;
      if (type === 'error' && !toast.isActive(id)) {
        toast.show({
          id,
          render: () => {
            return (
              <Box
                bg="error.500"
                px="1.5"
                py="1.5"
                rounded="sm"
                mb={5}
                _text={{
                  fontSize: 'md',
                  fontWeight: 'medium',
                  color: 'white',
                  letterSpacing: 'lg',
                }}
                fontSize={'md'}>
                {message}
              </Box>
            );
          },
        });
      } else if (type === 'success') {
        toast.show({
          render: () => {
            return (
              <Box
                bg="gray.400"
                px="1.5"
                py="1.5"
                rounded="sm"
                mb={5}
                _text={{
                  fontSize: 'md',
                  fontWeight: 'medium',
                  color: 'white',
                  letterSpacing: 'lg',
                }}
                fontSize={'md'}>
                {message}
              </Box>
            );
          },
        });
      } else if (type === 'info') {
        toast.show({
          render: () => {
            return (
              <Box
                bg="info.500"
                px="1.5"
                py="1.5"
                rounded="sm"
                mb={5}
                _text={{
                  fontSize: 'md',
                  fontWeight: 'medium',
                  color: 'white',
                  letterSpacing: 'lg',
                }}
                fontSize={'md'}>
                {message}
              </Box>
            );
          },
        });
      } else if (type === 'warning') {
        toast.show({
          render: () => {
            return (
              <Box
                bg="error.500"
                px="1.5"
                py="1.5"
                rounded="sm"
                mb={5}
                _text={{
                  fontSize: 'md',
                  fontWeight: 'medium',
                  color: 'white',
                  letterSpacing: 'lg',
                }}
                fontSize={'md'}>
                {message}
              </Box>
            );
          },
        });
      } else {
        if (!toast.isActive(id)) {
          toast.show({
            id,
            description: message,
          });
        }
      }
    },
  }));

  return null;
});

export default CommonToast;
