import { Button } from '@mewi/ui'
import CustomGoogleLogin from 'components/CustomGoogleLogin/CustomGoogleLogin'
import SmallContainer from 'components/SmallContainer/SmallContainer'
import { Link } from 'react-router-dom'
import * as styles from './SignInWithList.module.scss'
import { MdMail } from 'react-icons/md'

const SignInWithList = () => {
    return (
        <SmallContainer title='Logga in'>
            <ul className={styles.loginOptions}>
                <Link to='/login/email' className={styles.button} data-testid='emailLoginButton'>
                    <Button
                        icon={<MdMail size={22}/>}
                        label='Logga in med e-post'
                        defaultCasing
                        color='secondary'
                    />
                </Link>
                <CustomGoogleLogin />
            </ul>
        </SmallContainer>
    )
}

export default SignInWithList
