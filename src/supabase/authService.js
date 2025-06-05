import auth from './auth';
import { login, logout, setLoading } from '../store/authSlice';
import { store } from '../store/store'; // Named import

class AuthService {
  constructor(dispatch) {
    this.dispatch = dispatch;
    this.loading = false;
    this.error = null;
    this.initializeAuth();
  }

  setLoading(value) {
    this.loading = value;
    this.dispatch(setLoading(value));
  }

  setError(value) {
    this.error = value;
  }

  async initializeAuth() {
    this.setLoading(true);
    console.log('Initializing auth session');
    const { data: { session }, error } = await auth.supabase.auth.getSession();
    if (error) {
      console.error('Session restoration error:', error);
      this.dispatch(logout());
      this.setLoading(false);
      return;
    }

    if (session?.user) {
      const { data: profile, error: profileError } = await auth.supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        this.dispatch(logout());
        this.setLoading(false);
        return;
      }

      const userProfile = {
        id: session.user.id,
        email: session.user.email,
        name: profile.name,
        avatar_url: profile.avatar_url,
      };

      // console.log('Session restored, dispatching login:', userProfile);
      this.dispatch(login(userProfile));
    } else {
      console.log('No session found');
      this.dispatch(logout());
    }
    this.setLoading(false);

    auth.supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, session);
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        this.fetchUserProfile(session.user);
      } else if (event === 'SIGNED_OUT') {
        this.dispatch(logout());
      }
    });
  }

  async fetchUserProfile(user) {
    if (!user) return;

    const { data: profile, error } = await auth.supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Profile fetch error:', error);
      this.dispatch(logout());
      return;
    }

    const userProfile = {
      id: user.id,
      email: user.email,
      name: profile.name,
      avatar_url: profile.avatar_url,
    };

    console.log('Dispatching login from auth change:', userProfile);
    this.dispatch(login(userProfile));
  }

  async signup({ name, email, avatar_url, password }) {
    this.setLoading(true);
    this.setError(null);

    const { data, error: signUpError } = await auth.supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      this.setLoading(false);
      this.setError(signUpError.message);
      console.error('Signup error:', signUpError);
      return null;
    }

    const user = data.user;

    if (user) {
      const { error: profileError } = await auth.supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name,
          avatar_url,
        });

      if (profileError) {
        this.setLoading(false);
        this.setError(profileError.message);
        console.error('Profile upsert error:', profileError);
        return null;
      }

      const profileData = {
        id: user.id,
        email: user.email,
        name,
        avatar_url,
      };

      console.log('Signup successful, dispatching login:', profileData);
      this.dispatch(login(profileData));
      this.setLoading(false);
      return profileData;
    }

    this.setLoading(false);
    return null;
  }

  async signin({ email, password }) {
    this.setLoading(true);
    this.setError(null);

    const { data, error: signInError } = await auth.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      this.setLoading(false);
      this.setError(signInError.message);
      console.error('Signin error:', signInError);
      return null;
    }

    const user = data.user;

    const { data: profile, error: profileError } = await auth.supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      this.setError(profileError.message);
      console.error('Profile fetch error:', profileError);
      this.setLoading(false);
      return null;
    }

    const userProfile = {
      id: user.id,
      email: user.email,
      name: profile.name,
      avatar_url: profile.avatar_url,
    };

    console.log('Signin successful, dispatching login:', userProfile);
    this.dispatch(login(userProfile));
    this.setLoading(false);
    return userProfile;
  }

  async signout() {
    this.setLoading(true);
    const { error } = await auth.supabase.auth.signOut();
    if (error) {
      console.error('Signout error:', error);
    }
    console.log('Signout successful');
    this.dispatch(logout());
    this.setLoading(false);
  }

  getStatus() {
    return {
      loading: this.loading,
      error: this.error,
    };
  }
}

const authService = new AuthService(store.dispatch);
export default authService;