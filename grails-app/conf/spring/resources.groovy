import org.karajanresearch.oma.AuthenticationTokenGenerator
import org.karajanresearch.oma.UserPasswordEncoderListener
import org.karajanresearch.oma.CurrentUserTenantResolver
import org.karajanresearch.oma.MySecurityEventListener

// Place your Spring DSL code here
beans = {
    userPasswordEncoderListener(UserPasswordEncoderListener)
    currentUserTenantResolver(CurrentUserTenantResolver)
    tokenGenerator(AuthenticationTokenGenerator)
    mySecurityEventListener(MySecurityEventListener)
}
