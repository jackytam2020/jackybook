import React, { useState, FormEvent } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import Typography from '@mui/material/Typography';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import axios from 'axios';
import Dropzone from 'react-dropzone';
import { useDispatch } from 'react-redux';
import { setLogin } from '../state/index';
import { useRouter } from 'next/navigation';
import { Socket } from 'socket.io-client';

interface Picture {
  path?: string;
  lastModified: number;
  lastModifiedDate?: Date;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
}

interface RegisterValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  location: string;
  occupation: string;
  picture: Picture;
}

interface LoginValues {
  email: string;
  password: string;
}

interface Props {
  page: string;
}

interface File {
  append: Function;
}

const Form: React.FC<Props> = ({ page, socket }) => {
  const [registerValues, setRegisterValues] = useState<RegisterValues>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    location: '',
    occupation: '',
    picture: {
      path: '',
      lastModified: 0,
      lastModifiedDate: new Date(),
      name: '',
      size: 0,
      type: '',
      webkitRelativePath: '',
    },
  });

  const [loginValues, setLoginValues] = useState<LoginValues>({
    email: '',
    password: '',
  });

  const isNonMobile = useMediaQuery('(min-width:600px)');
  const dispatch = useDispatch();
  const router = useRouter();

  const registerUser = async () => {
    const formData: File = new FormData();

    formData.append('firstName', registerValues.firstName);
    formData.append('lastName', registerValues.lastName);
    formData.append('password', registerValues.password);
    formData.append('email', registerValues.email);
    formData.append('location', registerValues.location);
    formData.append('occupation', registerValues.occupation);
    formData.append('picture', registerValues.picture);
    formData.append('picturePath', registerValues.picture.name);

    const response = await axios.post(
      'http://localhost:8080/auth/register',
      formData
    );

    console.log(response);
    console.log(registerValues.picture);
  };

  const loginUser = async () => {
    const { data } = await axios.post('http://localhost:8080/auth/login', {
      email: loginValues.email,
      password: loginValues.password,
    });

    if (data) {
      dispatch(
        setLogin({
          user: data.user,
          token: data.token,
        })
      );
      // socket.emit('newUser', data.user._id);
      router.push('/home');
    }
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (page === 'register') {
      registerUser();
    } else if (page === 'login') {
      loginUser();
    }
  };

  console.log(socket);

  return (
    <>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
        encType="multipart/form-data"
      >
        <Box
          display="grid"
          gap="30px"
          gridTemplateColumns="repeat(4, minmax(0,1fr))"
          sx={{
            '& > div': { gridColumn: isNonMobile ? undefined : 'span 4' },
          }}
          paddingTop="1rem"
          paddingBottom="1rem"
        >
          {page === 'register' && (
            <>
              <TextField
                label="First Name"
                value={registerValues.firstName}
                onChange={(e) => {
                  setRegisterValues({
                    ...registerValues,
                    firstName: e.target.value,
                  });
                }}
                name="firstName"
                sx={{ gridColumn: 'span 2' }}
              />
              <TextField
                label="Last Name"
                value={registerValues.lastName}
                name="Last Name"
                onChange={(e) => {
                  setRegisterValues({
                    ...registerValues,
                    lastName: e.target.value,
                  });
                }}
                sx={{ gridColumn: 'span 2' }}
              />
              <TextField
                label="Location"
                value={registerValues.location}
                name="Location"
                onChange={(e) => {
                  setRegisterValues({
                    ...registerValues,
                    location: e.target.value,
                  });
                }}
                sx={{ gridColumn: 'span 4' }}
              />
              <TextField
                label="Occupation"
                value={registerValues.occupation}
                name="Occupation"
                onChange={(e) => {
                  setRegisterValues({
                    ...registerValues,
                    occupation: e.target.value,
                  });
                }}
                sx={{ gridColumn: 'span 4' }}
              />
              <Box
                gridColumn="span 4"
                border={`1px solid black`}
                borderRadius="5px"
                p="1rem"
              >
                <Dropzone
                  multiple={false}
                  onDrop={(acceptedFiles) => {
                    // const file = acceptedFiles[0];

                    // const inComingPicture = {
                    //   path: URL.createObjectURL(file),
                    //   lastModified: file.lastModified,
                    //   lastModifiedDate: file.lastModifiedDate,
                    //   name: file.name,
                    //   size: file.size,
                    //   type: file.type,
                    //   webkitRelativePath: file.webkitRelativePath,
                    // };
                    setRegisterValues({
                      ...registerValues,
                      picture: acceptedFiles[0],
                    });
                  }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <Box
                      {...getRootProps()}
                      border={`2px dashed black`}
                      p="1rem"
                      sx={{ '&:hover': { cursor: 'pointer' } }}
                    >
                      <input {...getInputProps()} name="picture" />
                      {!registerValues.picture ? (
                        <p>Add Picture Here</p>
                      ) : (
                        <div>
                          <Typography>{registerValues.picture.name}</Typography>
                          <EditOutlinedIcon />
                        </div>
                      )}
                    </Box>
                  )}
                </Dropzone>
              </Box>
              <TextField
                label="Email"
                value={registerValues.email}
                name="email"
                onChange={(e) => {
                  setRegisterValues({
                    ...registerValues,
                    email: e.target.value,
                  });
                }}
                sx={{ gridColumn: 'span 4' }}
              />
              <TextField
                label="Password"
                value={registerValues.password}
                name="password"
                type="password"
                onChange={(e) => {
                  setRegisterValues({
                    ...registerValues,
                    password: e.target.value,
                  });
                }}
                sx={{ gridColumn: 'span 4' }}
              />
              <Button
                variant="contained"
                sx={{ gridColumn: 'span 4' }}
                type="submit"
              >
                Submit
              </Button>
            </>
          )}
          {page === 'login' && (
            <>
              <TextField
                label="Email"
                value={loginValues.email}
                name="email"
                onChange={(e) => {
                  setLoginValues({
                    ...loginValues,
                    email: e.target.value,
                  });
                }}
                sx={{ gridColumn: 'span 4' }}
              />
              <TextField
                label="Password"
                value={loginValues.password}
                name="password"
                type="password"
                onChange={(e) => {
                  setLoginValues({
                    ...loginValues,
                    password: e.target.value,
                  });
                }}
                sx={{ gridColumn: 'span 4' }}
              />
              <Button
                variant="contained"
                sx={{ gridColumn: 'span 4' }}
                type="submit"
              >
                Login
              </Button>
            </>
          )}
        </Box>
      </form>
    </>
  );
};

export default Form;
