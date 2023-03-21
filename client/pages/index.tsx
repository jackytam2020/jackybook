import styles from '../styles/Login.module.scss';
import { useSelector } from 'react-redux';
import Form from '../components/Form';
import Link from 'next/link';

interface ModeRootState {
  mode: string;
}

const Login = () => {
  const mode = useSelector((state: ModeRootState) => state.mode);

  return (
    <div className={styles.login}>
      <div className={styles.login__formSection}>
        <h3>Welcome to JackyBook, please sign in</h3>
        <Form page={'login'} />
        <Link href={'/Register'} className={styles.login__registerLink}>
          Don't have an account? Sign up here
        </Link>
      </div>
    </div>
  );
};

export default Login;
