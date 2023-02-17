import React from 'react';
import Form from '../components/Form';
import registerStyles from '../styles/Register.module.scss';
import Link from 'next/link';

export const Register = () => {
  return (
    <div className={registerStyles.register}>
      <div className={registerStyles.register__formSection}>
        <h3>Welcome to JackyBook, please sign up</h3>
        <Form page={'register'} />
        <Link href={'/'} className={registerStyles.register__registerLink}>
          Already have an account? Please sign in
        </Link>
      </div>
    </div>
  );
};

export default Register;
