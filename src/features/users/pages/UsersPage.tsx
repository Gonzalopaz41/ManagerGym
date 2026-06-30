import { useEffect, useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux.hook';
import { fetchUsersThunk } from '../slice/users.thunk';
import UsersTable from '../components/UsersTable';
import EditUserFieldDialog, { type EditableField } from '../components/EditUserFieldDialog';
import CreateUserDialog from '../components/CreateUserDialog';
import type { User } from '../types/users.types';

const SkeletonRow = () => (
  <tr className="border-t border-[#111111]">
    {[140, 80, 60, 40].map((w, i) => (
      <td key={i} className="px-4 py-3">
        <div className="h-4 bg-[#1a1a1a] rounded animate-pulse" style={{ width: w }} />
      </td>
    ))}
  </tr>
);

const UsersPage = () => {
  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector((state) => state.users);

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<{ user: User; field: EditableField } | null>(null);

  useEffect(() => {
    dispatch(fetchUsersThunk());
  }, [dispatch]);

  const handleEdit = (user: User, field: EditableField) => {
    setEditTarget({ user, field });
  };

  return (
    <div className="p-6 flex flex-col gap-6 max-w-[1200px]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Usuarios</h1>
          <p className="text-sm text-[#888888] mt-0.5">
            Gestioná el acceso del equipo al sistema
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="h-9 rounded-[6px] bg-white text-black hover:bg-[#e0e0e0] text-sm font-medium border-0 flex items-center gap-2"
        >
          <UserPlus size={15} />
          Nuevo usuario
        </Button>
      </div>

      {error && <p className="text-sm text-[#ff4444]">{error}</p>}

      {loading ? (
        <div className="border border-[#222222] rounded-[8px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[480px]">
              <thead>
                <tr className="bg-[#0a0a0a]">
                  <th className="text-left px-4 py-3 text-[#888888] font-medium">Usuario</th>
                  <th className="text-left px-4 py-3 text-[#888888] font-medium">Rol</th>
                  <th className="text-left px-4 py-3 text-[#888888] font-medium">Activo</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)}
              </tbody>
            </table>
          </div>
        </div>
      ) : users.length === 0 ? (
        <div className="border border-[#222222] rounded-[8px] py-12 text-center">
          <p className="text-[#888888] text-sm">No hay usuarios registrados.</p>
        </div>
      ) : (
        <UsersTable users={users} onEdit={handleEdit} />
      )}

      <CreateUserDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
      />

      {editTarget && (
        <EditUserFieldDialog
          open={!!editTarget}
          onClose={() => setEditTarget(null)}
          user={editTarget.user}
          field={editTarget.field}
        />
      )}
    </div>
  );
};

export default UsersPage;
