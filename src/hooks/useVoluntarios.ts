import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { voluntariosApi, Voluntario, VoluntarioCreate } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export function useVoluntarios() {
  return useQuery({
    queryKey: ['voluntarios'],
    queryFn: voluntariosApi.listar,
  });
}

export function useVoluntario(id: number) {
  return useQuery({
    queryKey: ['voluntarios', id],
    queryFn: () => voluntariosApi.buscarPorId(id),
    enabled: !!id,
  });
}

export function useCriarVoluntario() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (voluntario: VoluntarioCreate) => voluntariosApi.criar(voluntario),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['voluntarios'] });
      toast({
        title: 'Sucesso!',
        description: 'Voluntário cadastrado com sucesso.',
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível cadastrar o voluntário.',
        variant: 'destructive',
      });
    },
  });
}

export function useAtualizarVoluntario() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, voluntario }: { id: number; voluntario: VoluntarioCreate }) =>
      voluntariosApi.atualizar(id, voluntario),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['voluntarios'] });
      toast({
        title: 'Sucesso!',
        description: 'Voluntário atualizado com sucesso.',
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o voluntário.',
        variant: 'destructive',
      });
    },
  });
}

export function useDeletarVoluntario() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => voluntariosApi.deletar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['voluntarios'] });
      toast({
        title: 'Sucesso!',
        description: 'Voluntário removido com sucesso.',
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o voluntário. Verifique se ele não está em nenhuma escala.',
        variant: 'destructive',
      });
    },
  });
}
