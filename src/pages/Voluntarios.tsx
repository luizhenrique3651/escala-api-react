import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, MoreHorizontal, Pencil, Trash2, Mail, Phone, User, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { useVoluntarios, useCriarVoluntario, useAtualizarVoluntario, useDeletarVoluntario } from '@/hooks/useVoluntarios';
import { Voluntario, VoluntarioCreate, UsuarioCreate } from '@/lib/api';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Voluntarios() {
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVoluntario, setSelectedVoluntario] = useState<Voluntario | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
  });

  const { data: voluntarios, isLoading } = useVoluntarios();
  const criarVoluntario = useCriarVoluntario();
  const atualizarVoluntario = useAtualizarVoluntario();
  const deletarVoluntario = useDeletarVoluntario();

  const filteredVoluntarios = voluntarios?.filter(
    (v) =>
      v.nome.toLowerCase().includes(search.toLowerCase()) ||
      v.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenDialog = (voluntario?: Voluntario) => {
    if (voluntario) {
      setSelectedVoluntario(voluntario);
      setFormData({
        nome: voluntario.nome,
        email: voluntario.email,
        senha: '',
        telefone: voluntario.telefone || '',
      });
    } else {
      setSelectedVoluntario(null);
      setFormData({ nome: '', email: '', senha: '', telefone: '' });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload: VoluntarioCreate = {
      nome: formData.nome,
      usuario: {
        email: formData.email,
        senha: formData.senha,
        role: 'COORDENADOR',
      },
    };

    if (selectedVoluntario) {
      await atualizarVoluntario.mutateAsync({
        id: selectedVoluntario.id,
        voluntario: payload,
      });
    } else {
      await criarVoluntario.mutateAsync(payload);
    }
    
    setIsDialogOpen(false);
    setFormData({ nome: '', email: '', senha: '', telefone: '' });
  };

  const handleDelete = async () => {
    if (selectedVoluntario) {
      await deletarVoluntario.mutateAsync(selectedVoluntario.id);
      setIsDeleteDialogOpen(false);
      setSelectedVoluntario(null);
    }
  };

  const openDeleteDialog = (voluntario: Voluntario) => {
    setSelectedVoluntario(voluntario);
    setIsDeleteDialogOpen(true);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Voluntários</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os voluntários do projeto
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gradient-primary shadow-primary text-white">
          <Plus className="w-4 h-4 mr-2" />
          Novo Voluntário
        </Button>
      </motion.div>

      {/* Search */}
      <motion.div variants={itemVariants}>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Buscar por nome ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-40 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      ) : filteredVoluntarios && filteredVoluntarios.length > 0 ? (
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <AnimatePresence>
            {filteredVoluntarios.map((voluntario) => (
              <motion.div
                key={voluntario.id}
                variants={itemVariants}
                layout
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Card className="card-elevated group">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-semibold text-lg">
                          {voluntario.nome.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {voluntario.nome}
                          </h3>
                          <Badge
                            variant={voluntario.ativo ? 'default' : 'secondary'}
                            className={voluntario.ativo ? 'bg-success/20 text-success hover:bg-success/30' : ''}
                          >
                            {voluntario.ativo ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenDialog(voluntario)}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openDeleteDialog(voluntario)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{voluntario.email}</span>
                      </div>
                      {voluntario.telefone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          <span>{voluntario.telefone}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="text-center py-16">
          <User className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Nenhum voluntário encontrado
          </h3>
          <p className="text-muted-foreground mb-4">
            {search
              ? 'Tente ajustar sua busca'
              : 'Comece adicionando o primeiro voluntário'}
          </p>
          {!search && (
            <Button onClick={() => handleOpenDialog()} className="gradient-primary text-white">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Voluntário
            </Button>
          )}
        </motion.div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedVoluntario ? 'Editar Voluntário' : 'Novo Voluntário'}
            </DialogTitle>
            <DialogDescription>
              {selectedVoluntario
                ? 'Atualize as informações do voluntário'
                : 'Preencha os dados para cadastrar um novo voluntário'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome completo</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="João da Silva"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="joao@email.com"
                  required
                />
              </div>
              {!selectedVoluntario && (
                <div className="space-y-2">
                  <Label htmlFor="senha">Senha</Label>
                  <Input
                    id="senha"
                    type="password"
                    value={formData.senha}
                    onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                    placeholder="••••••••"
                    required={!selectedVoluntario}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone (opcional)</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="gradient-primary text-white"
                disabled={criarVoluntario.isPending || atualizarVoluntario.isPending}
              >
                {criarVoluntario.isPending || atualizarVoluntario.isPending
                  ? 'Salvando...'
                  : selectedVoluntario
                  ? 'Atualizar'
                  : 'Cadastrar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover Voluntário</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover <strong>{selectedVoluntario?.nome}</strong>?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deletarVoluntario.isPending}
            >
              {deletarVoluntario.isPending ? 'Removendo...' : 'Remover'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
