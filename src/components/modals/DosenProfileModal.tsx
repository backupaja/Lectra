import React, { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal';
import { supabase } from '../../lib/supabase';

interface DosenProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  dosenId: string;
}

export function DosenProfileModal({ isOpen, onClose, dosenId }: DosenProfileModalProps) {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!isOpen || !dosenId) {
      setProfile(null);
      return;
    }

    const fetchProfile = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.rpc('get_public_dosen_profile', {
          p_dosen_id: dosenId
        });

        if (error) throw error;
        setProfile(data?.dosen || null);
      } catch (err) {
        console.error('Error fetching dosen profile', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isOpen, dosenId]);

  return (
    <Modal open={isOpen} onClose={onClose} title="Profil Dosen" size="md">
      {loading ? (
        <div className="flex justify-center p-8">Loading...</div>
      ) : profile ? (
        <div className="space-y-4 text-sm text-[#1F2937]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#8F2438] rounded-full flex items-center justify-center text-white text-xl font-bold">
              {profile.nama?.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-bold text-lg">{profile.nama}</h3>
              <p className="text-[#667085]">{profile.nip}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <p className="text-xs text-[#98A2B3]">Fakultas</p>
              <p className="font-medium">{profile.fakultas || '-'}</p>
            </div>
            <div>
              <p className="text-xs text-[#98A2B3]">Program Studi</p>
              <p className="font-medium">{profile.program_studi || '-'}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center p-8 text-[#98A2B3]">Data tidak ditemukan</div>
      )}
    </Modal>
  );
}
