import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Lock, Eye, EyeOff, RotateCcw, X, AlertTriangle, CheckCircle } from 'lucide-react';

interface ResetDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const REQUIRED_PASSWORD = 'PCP123';

export const ResetDayModal: React.FC<ResetDayModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setShowPassword(false);
      setErrorMessage(null);
      setIsSuccess(false);
      // Auto-focus the input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === REQUIRED_PASSWORD) {
      setErrorMessage(null);
      setIsSuccess(true);
      setTimeout(() => {
        onConfirm();
        onClose();
      }, 400);
    } else {
      setErrorMessage('Senha incorreta! Digite a senha de autorização do PCP.');
      inputRef.current?.select();
    }
  };

  return (
    <div
      id="modal-zerar-dia-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="modal-zerar-dia"
        className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-md w-full shadow-2xl shadow-slate-950/90 overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight font-display">
                Zerar Produção do Dia
              </h3>
              <p className="text-xs text-slate-400">
                Acesso restrito - Autorização PCP
              </p>
            </div>
          </div>
          <button
            type="button"
            id="btn-fechar-modal-senha"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block text-amber-200">Atenção operacional:</span>
              Esta ação zera todos os contadores de produção diária e ocorrências ativas na nuvem para iniciar um novo dia limpo.
            </div>
          </div>

          <div>
            <label
              htmlFor="input-senha-zerar-dia"
              className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
            >
              Senha de Autorização
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                ref={inputRef}
                id="input-senha-zerar-dia"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Digite a senha (PCP123)..."
                className={`w-full pl-9 pr-10 py-2.5 bg-slate-950 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none transition-all ${
                  errorMessage
                    ? 'border-rose-500/80 ring-2 ring-rose-500/20 focus:border-rose-500'
                    : 'border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                }`}
                autoComplete="off"
              />
              <button
                type="button"
                id="btn-toggle-senha"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errorMessage && (
              <p
                id="erro-senha-zerar-dia"
                className="text-xs text-rose-400 font-medium mt-1.5 flex items-center gap-1.5 animate-in fade-in"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
                {errorMessage}
              </p>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-3 flex items-center justify-end gap-2.5">
            <button
              type="button"
              id="btn-cancelar-zerar-dia"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="btn-confirmar-zerar-dia"
              disabled={isSuccess || !password.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-amber-950/50 hover:shadow-amber-500/20 transition-all active:scale-95"
            >
              {isSuccess ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Autorizado! Zerando...</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>Confirmar e Zerar Dia</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
