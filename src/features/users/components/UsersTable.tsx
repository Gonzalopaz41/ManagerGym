import { KeyRound, Pencil, ShieldCheck } from 'lucide-react';
import { useAppDispatch } from '@/shared/hooks/redux.hook';
import { updateUserThunk } from '../slice/users.thunk';
import type { User } from '../types/users.types';
import type { EditableField } from './EditUserFieldDialog';

interface Props {
  users: User[];
  onEdit: (user: User, field: EditableField) => void;
}

const roleConfig: Record<string, { label: string; className: string }> = {
  admin: { label: 'Admin', className: 'bg-[#ffffff15] text-[#ffffff] border border-[#ffffff30]' },
  base:  { label: 'Base',  className: 'bg-[#22222280] text-[#888888] border border-[#333333]'  },
};

const UsersTable = ({ users, onEdit }: Props) => {
  const dispatch = useAppDispatch();

  const handleToggleActive = (user: User) => {
    dispatch(updateUserThunk({ id: user.id, payload: { isActive: !user.isActive } }));
  };

  return (
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
            {users.map((user) => {
              const cfg = roleConfig[user.Role] ?? roleConfig.base;
              return (
                <tr
                  key={user.id}
                  className="border-t border-[#111111] hover:bg-[#0f0f0f] transition-colors"
                >
                  <td className="px-4 py-3 text-white">{user.userName}</td>

                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-xs font-medium ${cfg.className}`}>
                      {cfg.label}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <button
                      role="switch"
                      aria-checked={user.isActive}
                      onClick={() => handleToggleActive(user)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${
                        user.isActive ? 'bg-[#00cc88]' : 'bg-[#333333]'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                          user.isActive ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(user, 'userName')}
                        className="text-[#888888] hover:text-white transition-colors p-1"
                        aria-label="Editar nombre de usuario"
                        title="Editar usuario"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => onEdit(user, 'password')}
                        className="text-[#888888] hover:text-white transition-colors p-1"
                        aria-label="Cambiar contraseña"
                        title="Cambiar contraseña"
                      >
                        <KeyRound size={14} />
                      </button>
                      <button
                        onClick={() => onEdit(user, 'Role')}
                        className="text-[#888888] hover:text-white transition-colors p-1"
                        aria-label="Cambiar rol"
                        title="Cambiar rol"
                      >
                        <ShieldCheck size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTable;
