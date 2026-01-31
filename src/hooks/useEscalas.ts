import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { escalasApi, EscalaCreate } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export function useEscalas() {
  return useQuery({
    queryKey: ['escalas'],
    queryFn: escalasApi.listar,
  });
}

export function useEscala(id: number) {
  return useQuery({
    queryKey: ['escalas', id],
    queryFn: () => escalasApi.buscarPorId(id),
    enabled: !!id,
  });
}

export function useEscalaPorData(data: string) {
  return useQuery({
    queryKey: ['escalas', 'data', data],
    queryFn: () => escalasApi.buscarPorData(data),
    enabled: !!data,
  });
}

export function useCriarEscala() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (escala: EscalaCreate) => escalasApi.criar(escala),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['escalas'] });
      toast({
        title: 'Sucesso!',
        description: 'Escala criada com sucesso.',
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar a escala.',
        variant: 'destructive',
      });
    },
  });
}

export function useAtualizarEscala() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, escala }: { id: number; escala: EscalaCreate }) =>
      escalasApi.atualizar(id, escala),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['escalas'] });
      toast({
        title: 'Sucesso!',
        description: 'Escala atualizada com sucesso.',
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar a escala.',
        variant: 'destructive',
      });
    },
  });
}

export function useDeletarEscala() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => escalasApi.deletar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['escalas'] });
      toast({
        title: 'Sucesso!',
        description: 'Escala removida com sucesso.',
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível remover a escala.',
        variant: 'destructive',
      });
    },
  });
}
