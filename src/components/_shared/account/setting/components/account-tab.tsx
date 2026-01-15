import male from '@/_assets/default-profile/male.png';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { User } from 'lucide-react';
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
  <div className="p-8 space-y-6 mb-50">
    <div
      className="rounded-3xl p-8 text-white overflow-hidden relative border-2 border-white/20 shadow-lg"
      style={{
        background: `linear-gradient(135deg, ${mainColor}, ${secondaryColor})`,
      }}
    >
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-8">
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
            className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-white shadow-xl hover:shadow-2xl transition-all cursor-pointer"
            onClick={() => document.getElementById('ubahFotoProfile')?.click()}
          >
            <Image
              src={preview || profileImage || male}
              alt="Profile"
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
          {profile && (
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center bg-green-500 text-white text-sm font-bold shadow-lg">
              ✓
            </div>
          )}
        </div>

        <div className="flex-1">
          <h3 className="text-2xl font-black mb-2">{session?.user?.name}</h3>
          <p className="text-white/90 mb-4 font-medium">
            {session?.user.email}
          </p>
          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={() =>
                document.getElementById('ubahFotoProfile')?.click()
              }
              className="rounded-3xl text-white font-bold bg-white/20 hover:bg-white/30 border-2 border-white/30 backdrop-blur-sm transition-all shadow-sm hover:shadow-md"
            >
              <User className="w-4 h-4 mr-2" />
              Ubah Foto
            </Button>

            {profile && !loading && (
              <>
                <Button
                  onClick={() => setProfile(undefined)}
                  className="rounded-3xl bg-white/10 hover:bg-white/20 text-white border-2 border-white/20 backdrop-blur-sm font-bold transition-all shadow-sm"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleChangeProfile}
                  className="rounded-3xl text-white font-bold bg-white/40 hover:bg-white/50 border-2 border-white/30 backdrop-blur-sm transition-all shadow-sm hover:shadow-md"
                >
                  Simpan
                </Button>
              </>
            )}

            {loading && (
              <div className="flex items-center px-4 bg-white/10 rounded-3xl backdrop-blur-sm border-2 border-white/20">
                <Spinner />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Account Details Card */}
    <Card className="border-2 border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all">
      <CardHeader className="pb-4">
        <CardTitle
          className="text-lg font-black flex items-center gap-2"
          style={{ color: mainColor }}
        >
          <div
            className="w-8 h-8 rounded-3xl flex items-center justify-center text-white"
            style={{ backgroundColor: mainColor }}
          >
            <User className="w-4 h-4" />
          </div>
          Informasi Akun
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm font-bold text-gray-500">Nama Lengkap</p>
          <p className="text-lg font-black text-gray-900">
            {session?.user?.name}
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-sm font-bold text-gray-500">Email</p>
          <p className="text-lg font-black text-gray-900">
            {session?.user.email}
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
);
