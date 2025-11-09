
import { useEffect, useMemo, useState } from "react";
import {
  FiMail, FiPhone, FiShield, FiUser, FiBriefcase, FiLock, FiUpload,
} from "react-icons/fi";
import {
  changePassword,
  getProfile,
  updateMyProfile,
  buildMediaUrl,
} from "../../../services/profile";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState("");

  // Profile (view + editable copy)
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    organization_name: "",
  });

  // Picture
  const [picFile, setPicFile] = useState(null);
  const [picPreview, setPicPreview] = useState("");

  // Save/profile alerts
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState("");
  const [saveOk, setSaveOk] = useState("");

  // Password
  const [pwd, setPwd] = useState({ old_password: "", new_password: "", confirm: "" });
  const [pwdBusy, setPwdBusy] = useState(false);
  const [pwdErr, setPwdErr] = useState("");
  const [pwdOk, setPwdOk] = useState("");

  // Fetch profile on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setLoadErr("");
      try {
        const { data } = await getProfile();
        if (!mounted) return;

        const hydrated = {
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          phone: data.phone || "",
          role: data.role || "",
          organization_name: data.organization_name || "",
          profile_picture: buildMediaUrl(data.profile_picture),
        };

        setProfile(hydrated);
        setForm({
          first_name: hydrated.first_name,
          last_name: hydrated.last_name,
          phone: hydrated.phone,
          organization_name: hydrated.organization_name,
        });
        setPicPreview(hydrated.profile_picture || "");
      } catch (e) {
        if (mounted) setLoadErr("Failed to load profile.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const initials = useMemo(() => {
    const f = (profile?.first_name || "").trim();
    const l = (profile?.last_name || "").trim();
    const s = `${f ? f[0] : ""}${l ? l[0] : ""}` || "U";
    return s.toUpperCase();
  }, [profile]);

  const fullName = useMemo(() => {
    const f = (profile?.first_name || "").trim();
    const l = (profile?.last_name || "").trim();
    return [f, l].filter(Boolean).join(" ") || "User";
  }, [profile]);

  const onField = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const onPickPic = (e) => {
    const file = e.target.files?.[0];
    setPicFile(file || null);
    if (file) {
      const url = URL.createObjectURL(file);
      setPicPreview(url);
    } else {
      setPicPreview(profile?.profile_picture || "");
    }
  };


const submitProfile = async (e) => {
  e.preventDefault();
  setSaving(true);
  setSaveErr("");
  setSaveOk("");
  try {
    const fd = new FormData();
    if (form.first_name !== profile.first_name) fd.append("first_name", form.first_name);
    if (form.last_name !== profile.last_name)  fd.append("last_name",  form.last_name);
    if (form.phone !== profile.phone)          fd.append("phone",      form.phone);
    if (form.organization_name !== profile.organization_name) {
      fd.append("organization_name", form.organization_name);
    }
    if (picFile) fd.append("profile_picture", picFile);

    if ([...fd.keys()].length === 0) {
      setSaveOk("Nothing to update.");
    } else {
      await updateMyProfile(fd);

      // Re-fetch to get the final canonical media path from the server
      const { data: fresh } = await getProfile();
      const hydrated = {
        first_name: fresh.first_name || "",
        last_name: fresh.last_name || "",
        email: fresh.email || "",
        phone: fresh.phone || "",
        role: fresh.role || "",
        organization_name: fresh.organization_name || "",
        profile_picture: buildMediaUrl(fresh.profile_picture),
      };

      setProfile(hydrated);
      setForm({
        first_name: hydrated.first_name,
        last_name: hydrated.last_name,
        phone: hydrated.phone,
        organization_name: hydrated.organization_name,
      });
      setPicPreview(hydrated.profile_picture || "");
      setPicFile(null);

      setSaveOk("Profile updated successfully.");
    }
  } catch (e1) {
    const data = e1?.response?.data;
    setSaveErr(data?.detail || data?.message || "Failed to update profile.");
  } finally {
    setSaving(false);
  }
};
// ...





  const onPwdChange = (e) => {
    const { name, value } = e.target;
    setPwd((s) => ({ ...s, [name]: value }));
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    setPwdErr("");
    setPwdOk("");

    if (!pwd.old_password || !pwd.new_password) {
      setPwdErr("Both old and new passwords are required.");
      return;
    }
    if (pwd.new_password !== pwd.confirm) {
      setPwdErr("New password and confirmation do not match.");
      return;
    }

    setPwdBusy(true);
    try {
      await changePassword({ old_password: pwd.old_password, new_password: pwd.new_password });
      setPwdOk("Password updated successfully.");
      setPwd({ old_password: "", new_password: "", confirm: "" });
    } catch (e2) {
      const data = e2?.response?.data;
      setPwdErr(data?.detail || data?.message || "Could not update password.");
    } finally {
      setPwdBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow animate-pulse text-sm text-gray-600">
        Loading profile…
      </div>
    );
  }
  if (loadErr) {
    return <div className="rounded-lg bg-white p-6 shadow text-rose-700">{loadErr}</div>;
  }
  if (!profile) return null;

  return (
    <div className="space-y-6">
      {/* Header / Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.25),transparent_45%)]" />
        <div className="relative flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-8">
          {/* Avatar */}
          <div className="relative">
            {picPreview ? (
              <img
                src={picPreview}
                alt={fullName}
                className="h-24 w-24 rounded-2xl object-cover ring-2 ring-white/50 shadow-lg"
              />
            ) : (
              <div className="h-24 w-24 rounded-2xl bg-white/15 text-white flex items-center justify-center text-3xl font-semibold ring-2 ring-white/30 shadow-lg">
                {initials}
              </div>
            )}
          </div>
          {/* Name & meta */}
          <div className="text-white">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{fullName}</h1>
            <p className="mt-1 text-white/80 flex items-center gap-2">
              <FiShield className="opacity-80" />
              <span className="capitalize">{profile.role || "member"}</span>
            </p>
            <p className="mt-1 text-white/80 flex items-center gap-2">
              <FiBriefcase className="opacity-80" />
              <span>{profile.organization_name || "—"}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Editable Profile + Password */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Editable Profile */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Profile</h3>

          {saveOk && (
            <div className="mb-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {saveOk}
            </div>
          )}
          {saveErr && (
            <div className="mb-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {saveErr}
            </div>
          )}

          <form onSubmit={submitProfile} className="space-y-3">
            {/* Email (read only) */}
            <Field
              icon={<FiMail className="text-gray-400" />}
              type="email"
              value={profile.email}
              readOnly
              placeholder="Email"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field
                icon={<FiUser className="text-gray-400" />}
                name="first_name"
                placeholder="First name"
                value={form.first_name}
                onChange={onField}
              />
              <Field
                icon={<FiUser className="text-gray-400" />}
                name="last_name"
                placeholder="Last name"
                value={form.last_name}
                onChange={onField}
              />
            </div>
            <Field
              icon={<FiPhone className="text-gray-400" />}
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={onField}
            />
            <Field
              icon={<FiBriefcase className="text-gray-400" />}
              name="organization_name"
              placeholder="Organization / Store"
              value={form.organization_name}
              onChange={onField}
            />

            {/* Picture picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile picture</label>
              <label className="flex items-center gap-2 w-full cursor-pointer rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm hover:bg-gray-100">
                <FiUpload className="text-gray-500" />
                <span className="text-gray-700">Choose image…</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onPickPic}
                  className="hidden"
                />
              </label>
              <p className="mt-1 text-xs text-gray-500">PNG/JPG, up to a few MB.</p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Change Password */}
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Change password</h3>

          {pwdOk && (
            <div className="mb-3 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {pwdOk}
            </div>
          )}
          {pwdErr && (
            <div className="mb-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {pwdErr}
            </div>
          )}

          <form onSubmit={submitPassword} className="space-y-3">
            <Field
              icon={<FiLock className="text-gray-400" />}
              type="password"
              name="old_password"
              placeholder="Current password"
              value={pwd.old_password}
              onChange={onPwdChange}
              autoComplete="current-password"
            />
            <Field
              icon={<FiLock className="text-gray-400" />}
              type="password"
              name="new_password"
              placeholder="New password"
              value={pwd.new_password}
              onChange={onPwdChange}
              autoComplete="new-password"
            />
            <Field
              icon={<FiLock className="text-gray-400" />}
              type="password"
              name="confirm"
              placeholder="Confirm new password"
              value={pwd.confirm}
              onChange={onPwdChange}
              autoComplete="new-password"
            />

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={pwdBusy}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {pwdBusy ? "Updating…" : "Update password"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Read-only contact card (quick view) */}
      <div className="rounded-xl border bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 mb-3">Contact</h3>
        <div className="grid gap-3 sm:grid-cols-3 text-sm">
          <IconRow icon={<FiMail />} label="Email" value={profile.email || "—"} />
          <IconRow icon={<FiPhone />} label="Phone" value={form.phone || "—"} />
          <IconRow icon={<FiBriefcase />} label="Organization" value={form.organization_name || "—"} />
        </div>
      </div>
    </div>
  );
}

/* -------- Small UI helpers -------- */
function Field({ icon, ...props }) {
  return (
    <div className="relative">
      {icon && <div className="pointer-events-none absolute left-3 top-2.5">{icon}</div>}
      <input
        {...props}
        className={`w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-sm bg-gray-50 
          focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none`}
      />
    </div>
  );
}

function IconRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        {icon}
      </span>
      <div>
        <div className="text-gray-600">{label}</div>
        <div className="font-medium text-gray-900">{value}</div>
      </div>
    </div>
  );
}
