import { useState } from 'react';
import styles from '../styles/Login.module.scss';
import Form from '../components/Form';
import Link from 'next/link';
import Head from 'next/head';

const Login = () => {
  const [loading, setLoading] = useState<boolean>(false);
  return (
    <>
      <Head>
        <title>Log in to Jackybook</title>
      </Head>
      <div className={styles.login}>
        <div className={styles.login__formSection}>
          <h3>Welcome to JackyBook, please sign in</h3>
          {loading === false ? (
            <>
              <Form page={'login'} setLoading={setLoading} />
              <Link href={'/Register'} className={styles.login__registerLink}>
                Don't have an account? Sign up here
              </Link>
            </>
          ) : (
            <h3 className={styles.login__loading}>Loading...</h3>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
