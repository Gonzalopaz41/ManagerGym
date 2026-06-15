import { useEffect, useState } from 'react';
import { Dialog } from 'radix-ui';
import { Loader2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux.hook';
import { createPaymentThunk, clearPaymentError } from '@/features/payments';

interface Props {
  open: boolean;
  onClose: () => void;
  clientId: string;
  clientName: string;
  onSuccess: () => void;
}

const today = () => new Date().toISOString().split('T')[0];

const PaymentFormDialog = ({ open, onClose, clientId, clientName, onSuccess }: Props) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.payments);

  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'cash' | 'transfer'>('cash');
  const [paymentDate, setPaymentDate] = useState(today());
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setAmount('');
      setMethod('cash');
      setPaymentDate(today());
      setLocalError(null);
      dispatch(clearPaymentError());
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const parsedAmount = Number(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      setLocalError('El monto debe ser un número mayor a 0');
      return;
    }
    if (!paymentDate) {
      setLocalError('La fecha es obligatoria');
      return;
    }

    const action = await dispatch(
      createPaymentThunk({ clientId, payload: { amount: parsedAmount, method, paymentDate } })
    );

    if (action.meta.requestStatus === 'rejected') {
      setLocalError((action.payload as string) ?? 'Error al registrar el pago');
      return;
    }

    onSuccess();
    onClose();
  };

  const inputClass =
    'h-9 w-full rounded-[6px] bg-[#0a0a0a] border border-[#222222] focus:border-white text-white placeholder:text-[#444444] px-3 text-sm outline-none transition-colors';

  const labelClass = 'block text-[13px] font-medium text-[#888888] mb-1.5';

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-[#000000] border border-[#222222] rounded-[8px] p-6 outline-none">

          <Dialog.Title className="text-[15px] font-semibold text-white mb-1">
            Registrar pago
          </Dialog.Title>
          <p className="text-sm text-[#888888] mb-6">{clientName}</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Monto */}
            <div>
              <label className={labelClass}>Monto *</label>
              <input
                type="number"
                min="1"
                step="1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="5000"
                className={inputClass}
                disabled={loading}
              />
            </div>

            {/* Método */}
            <div>
              <label className={labelClass}>Método de pago *</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as 'cash' | 'transfer')}
                className={`${inputClass} cursor-pointer`}
                disabled={loading}
              >
                <option value="cash">Efectivo</option>
                <option value="transfer">Transferencia</option>
              </select>
            </div>

            {/* Fecha */}
            <div>
              <label className={labelClass}>Fecha del pago *</label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className={`${inputClass} [color-scheme:dark]`}
                disabled={loading}
              />
            </div>

            {localError && (
              <p className="text-sm text-[#ff4444]">{localError}</p>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Dialog.Close asChild>
                <button
                  type="button"
                  disabled={loading}
                  className="h-9 px-4 rounded-[6px] border border-[#222222] text-white text-sm hover:border-[#444444] transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={loading}
                className="h-9 px-4 rounded-[6px] bg-white text-black text-sm font-medium hover:bg-[#e0e0e0] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                {loading ? 'Registrando...' : 'Registrar pago'}
              </button>
            </div>

          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default PaymentFormDialog;
