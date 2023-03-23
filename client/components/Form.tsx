import React, { useState } from 'react';
import {
  TextField,
  Box,
  Button,
  useMediaQuery,
  Typography,
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import axios from 'axios';

import Dropzone from 'react-dropzone';
import { useDispatch } from 'react-redux';
import { setLogin } from '../state/index';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

const Form: React.FC<Props> = ({ page }) => {
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

  const successfulSignUp = () =>
    toast.success('Account Signed Up', {
      position: 'bottom-right',
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      draggable: true,
      theme: 'colored',
    });

  const loginError = () =>
    toast.error('Incorrect Email or Password', {
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      draggable: true,
      theme: 'colored',
    });

  const RegisterError = () =>
    toast.error('Email already used by someone else', {
      position: 'bottom-right',
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      draggable: true,
      theme: 'colored',
    });

  const registerUser = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const formData: File = new FormData();

    formData.append('firstName', registerValues.firstName);
    formData.append('lastName', registerValues.lastName);
    formData.append('password', registerValues.password);
    formData.append('email', registerValues.email);
    formData.append('location', registerValues.location);
    formData.append('occupation', registerValues.occupation);

    if (registerValues.picture.path) {
      formData.append('picture', registerValues.picture);
      formData.append('picturePath', registerValues.picture.name);
    } else {
      formData.append('picturePath', 'default-profilepic.jpg');
    }

    try {
      await axios.post(`${process.env.HOST}/auth/register`, formData);
      successfulSignUp();
      setTimeout(() => {
        router.push('/');
      }, 1200);
    } catch {
      RegisterError();
    }
  };

  const loginUser = async () => {
    try {
      const { data } = await axios.post(`${process.env.HOST}/auth/login`, {
        email: loginValues.email,
        password: loginValues.password,
      });

      dispatch(
        setLogin({
          user: data.user,
          token: data.token,
        })
      );
      router.push('/home');
    } catch {
      loginError();
    }
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();

    if (page === 'register') {
      registerUser(e);
    } else if (page === 'login') {
      loginUser();
    }
  };

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
            '& > div': {
              gridColumn: isNonMobile ? undefined : 'span 4',
            },
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
                <p style={{ paddingBottom: '1rem' }}>Upload Profile Picture</p>
                <Dropzone
                  multiple={false}
                  onDrop={(acceptedFiles) => {
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
              {registerValues.email !== '' &&
              registerValues.password !== '' &&
              registerValues.firstName !== '' &&
              registerValues.lastName !== '' &&
              registerValues.location !== '' &&
              registerValues.occupation !== '' ? (
                <Button
                  variant="contained"
                  sx={{ gridColumn: 'span 4' }}
                  type="submit"
                >
                  Submit
                </Button>
              ) : (
                <span
                  style={{
                    cursor: 'not-allowed',
                    gridColumn: 'span 4',
                  }}
                >
                  <Button variant="contained" sx={{ width: '100%' }} disabled>
                    Submit
                  </Button>
                </span>
              )}
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
              {loginValues.email && loginValues.password !== '' ? (
                <Button
                  variant="contained"
                  sx={{ gridColumn: 'span 4' }}
                  type="submit"
                >
                  Login
                </Button>
              ) : (
                <span
                  style={{
                    cursor: 'not-allowed',
                    gridColumn: 'span 4',
                  }}
                >
                  <Button variant="contained" disabled sx={{ width: '100%' }}>
                    Login
                  </Button>
                </span>
              )}
            </>
          )}
        </Box>
        <ToastContainer
        // toastStyle={{ backgroundColor: 'green', color: 'white' }}
        />
      </form>
    </>
  );
};

export default Form;
