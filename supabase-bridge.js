(function () {
  const config = globalThis.LIFE_AUDIT_SUPABASE || {};
  const hasConfig = Boolean(config.url && config.anonKey);

  const initPromise = (async () => {
    if (!hasConfig) return null;
    try {
      const { createClient } = await import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
      return createClient(config.url, config.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
    } catch (error) {
      console.error("Life Audit Supabase init failed.", error);
      return null;
    }
  })();

  async function getClient() {
    return initPromise;
  }

  async function getSession() {
    const client = await getClient();
    if (!client) return { session: null, error: null };
    const { data, error } = await client.auth.getSession();
    return { session: data.session, error };
  }

  async function getUser() {
    const { session } = await getSession();
    return session?.user || null;
  }

  async function signUp({ email, password, name }) {
    const client = await getClient();
    if (!client) return { data: null, error: new Error("Supabase is not configured.") };
    return client.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name || "",
        },
        emailRedirectTo: config.redirectTo || undefined,
      },
    });
  }

  async function signIn({ email, password }) {
    const client = await getClient();
    if (!client) return { data: null, error: new Error("Supabase is not configured.") };
    return client.auth.signInWithPassword({ email, password });
  }

  async function signOut() {
    const client = await getClient();
    if (!client) return { error: null };
    return client.auth.signOut();
  }

  async function resetPassword(email) {
    const client = await getClient();
    if (!client) return { data: null, error: new Error("Supabase is not configured.") };
    const fallbackRedirect =
      config.redirectTo ||
      (typeof window !== "undefined" && window.location
        ? `${window.location.origin}${window.location.pathname}`
        : undefined);
    return client.auth.resetPasswordForEmail(email, {
      redirectTo: fallbackRedirect,
    });
  }

  async function updatePassword(password) {
    const client = await getClient();
    if (!client) return { data: null, error: new Error("Supabase is not configured.") };
    return client.auth.updateUser({ password });
  }

  async function saveDraft(kind, state) {
    const client = await getClient();
    const user = await getUser();
    if (!client || !user) return { data: null, error: new Error("No active user session.") };
    return client
      .from("audit_sessions")
      .upsert(
        {
          user_id: user.id,
          audit_kind: kind,
          state,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,audit_kind" }
      )
      .select()
      .single();
  }

  async function loadDraft(kind) {
    const client = await getClient();
    const user = await getUser();
    if (!client || !user) return { data: null, error: new Error("No active user session.") };
    return client
      .from("audit_sessions")
      .select("*")
      .eq("user_id", user.id)
      .eq("audit_kind", kind)
      .maybeSingle();
  }

  async function listDrafts() {
    const client = await getClient();
    const user = await getUser();
    if (!client || !user) return { data: [], error: null };
    return client
      .from("audit_sessions")
      .select("audit_kind, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });
  }

  globalThis.lifeAuditCloud = {
    configured: hasConfig,
    ready: initPromise,
    getClient,
    getSession,
    getUser,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    saveDraft,
    loadDraft,
    listDrafts,
  };
})();
