import org.karajanresearch.oma.UserPasswordEncoderListener
import org.karajanresearch.oma.CurrentUserTenantResolver

// Place your Spring DSL code here
beans = {
    userPasswordEncoderListener(UserPasswordEncoderListener)
    currentUserTenantResolver(CurrentUserTenantResolver)
}
