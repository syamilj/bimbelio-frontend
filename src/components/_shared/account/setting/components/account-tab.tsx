import male from '@/_assets/default-profile/male.png';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Camera, Mail, User } from 'lucide-react';
import Image from 'next/image';

export const AccountTab = ({
  session,
  profile,
  setProfile,
  preview,
  profileImage,
  loading,
  handleChangeProfile,
  mainColor,
  secondaryColor,
}: any) => (
  <div className="p-5 space-y-5 pb-20">
    {/* Profile Card */}
    <div
      className="rounded-3xl p-6 text-white relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
      }}
    >
      <div className="relative z-10 flex items-center gap-5">
        <div className="relative">
          <input
            id="ubahFotoProfile"
            type="file"
            className="absolute inset-0 w-0 h-0 opacity-0"
            onChange={(e) => {
              if (e.target.files) {
                setProfile(e.target.files[0]);
              }
            }}
          />
          <div
            className="w-20 h-20 rounded-3xl overflow-hidden border-2 border-white/30 cursor-pointer hover:opacity-90 transition-opacity shadow-lg"
            onClick={() => document.getElementById('ubahFotoProfile')?.click()}
          >
            <Image
              src={preview || profileImage || male}
              alt="Profile"
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
          {profile && (
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center bg-emerald-500 text-white text-[10px] font-bold ring-2 ring-white">
              ✓
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-xl font-black truncate">{session?.user?.name}</h3>
          <p className="text-white/70 text-sm truncate mt-0.5">{session?.user.email}</p>
          <div className="flex gap-2 mt-3 flex-wrap">
            <button
              onClick={() => document.getElementById('ubahFotoProfile')?.click()}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-3xl text-xs font-bold bg-white/20 hover:bg-white/30 transition-colors cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              Ubah Foto
            </button>
            {profile && !loading && (
              <>
                <button
                  onClick={() => setProfile(undefined)}
                  className="px-4 py-1.5 rounded-3xl text-xs font-bold bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleChangeProfile}
                  className="px-4 py-1.5 rounded-3xl text-xs font-bold bg-white/40 hover:bg-white/50 transition-colors cursor-pointer"
                >
                  Simpan
                </button>
              </>
            )}
            {loading && (
              <div className="flex items-center px-4 bg-white/10 rounded-3xl">
                <Spinner />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Info Cards */}
    <div className="rounded-3xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200">
        <h3 className="text-sm font-black text-slate-700 flex items-center gap-2">
          <User className="w-4 h-4" style={{ color: mainColor }} />
          Informasi Akun
        </h3>
      </div>
      <div className="divide-y divide-slate-100">
        <div className="px-5 py-3.5">
          <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: mainColor }}>Nama Lengkap</p>
          <p className="text-sm font-bold text-slate-800">{session?.user?.name}</p>
        </div>
        <div className="px-5 py-3.5">
          <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: mainColor }}>Email</p>
          <p className="text-sm font-bold text-slate-800">{session?.user.email}</p>
        </div>
      </div>
    </div>
  </div>
);
