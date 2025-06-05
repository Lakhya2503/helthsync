import { createClient } from '@supabase/supabase-js';
import conf from '../conf/conf';

export class Auth {
  supabase;
  constructor() {
    this.supabase = createClient(conf.supabaseURL, conf.supabaseAnonKey);
  }
}

const auth = new Auth();
export default auth;