import styles from '../styles/Login.module.scss';
import Form from '../components/Form';
import Link from 'next/link';
import Head from 'next/head';

const Login = () => {
  return (
    <>
      <Head>
        <title>Log in to Jackybook</title>
      </Head>
      <div className={styles.login}>
        <div className={styles.login__formSection}>
          <h3>Welcome to JackyBook, please sign in</h3>
          <Form page={'login'} />
          <Link href={'/Register'} className={styles.login__registerLink}>
            Don't have an account? Sign up here
          </Link>
        </div>
      </div>
    </>
  );
};

export default Login;
