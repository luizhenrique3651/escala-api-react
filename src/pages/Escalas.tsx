import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar as CalendarIcon, Users, MoreHorizontal, Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
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
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useEscalas, useCriarEscala, useAtualizarEscala, useDeletarEscala } from '@/hooks/useEscalas';
import { useVoluntarios } from '@/hooks/useVoluntarios';
import { Escala, EscalaCreate, extrairDataEscala } from '@/lib/api';
import { format, parseISO, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Escalas() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEscala, setSelectedEscala] = useState<Escala | null>(null);
  const [selectedVoluntariosIds, setSelectedVoluntariosIds] = useState<number[]>([]);

  const { data: escalas, isLoading: loadingEscalas } = useEscalas();
  const { data: voluntarios, isLoading: loadingVoluntarios } = useVoluntarios();
  const criarEscala = useCriarEscala();
  const atualizarEscala = useAtualizarEscala();
  const deletarEscala = useDeletarEscala();

  const escalasDoMes = escalas?.filter((escala) => {
    try {
      // Usar função helper que tenta data primeiro, depois dias
      const dataStr = extrairDataEscala(escala);

      if (!dataStr) {
        console.warn('Escala sem dias nem datas:', escala);
        return false;
      }

      return isSameMonth(parseISO(dataStr), currentMonth);
    } catch (e) {
      console.error('Erro ao filtrar escala por mês:', e);
      return false;
    }
  });

  const getEscalaForDate = (date: Date) => {
    return escalas?.find((escala) => {
      try {
        // Usar função helper que tenta data primeiro, depois dias
        const dataStr = extrairDataEscala(escala);

        if (!dataStr) {
          return false;
        }

        return isSameDay(parseISO(dataStr), date);
      } catch (e) {
        return false;
      }
    });
  };

  const handleOpenDialog = (date: Date, escala?: Escala) => {
    setSelectedDate(date);
    if (escala) {
      setSelectedEscala(escala);
      setSelectedVoluntariosIds(escala.voluntarios?.map((v) => v.id) || []);
    } else {
      setSelectedEscala(null);
      setSelectedVoluntariosIds([]);
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDate) return;

    const escalaData: EscalaCreate = {
      data: format(selectedDate, 'yyyy-MM-dd'),
      voluntariosIds: selectedVoluntariosIds,
    };

    if (selectedEscala) {
      await atualizarEscala.mutateAsync({ id: selectedEscala.id, escala: escalaData });
    } else {
      await criarEscala.mutateAsync(escalaData);
    }

    setIsDialogOpen(false);
    setSelectedVoluntariosIds([]);
  };

  const handleDelete = async () => {
    if (selectedEscala) {
      await deletarEscala.mutateAsync(selectedEscala.id);
      setIsDeleteDialogOpen(false);
      setSelectedEscala(null);
    }
  };

  const toggleVoluntario = (id: number) => {
    setSelectedVoluntariosIds((prev) =>
      prev.includes(id) ? prev.filter((vid) => vid !== id) : [...prev, id]
    );
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
          <h1 className="text-3xl font-bold text-foreground">Escalas</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as escalas de voluntários
          </p>
        </div>
        <Button
          onClick={() => handleOpenDialog(new Date())}
          className="gradient-primary shadow-primary text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nova Escala
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendário */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <Card className="card-elevated">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Calendário</CardTitle>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground capitalize">
                {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
              </p>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate || undefined}
                onSelect={(date) => date && setSelectedDate(date)}
                month={currentMonth}
                onMonthChange={setCurrentMonth}
                locale={ptBR}
                className="rounded-md"
                modifiers={{
                  hasEscala: (date) => !!getEscalaForDate(date),
                }}
                modifiersClassNames={{
                  hasEscala: 'bg-primary/20 text-primary font-bold',
                }}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Lista de Escalas do Mês */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="card-elevated h-full">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                Escalas de {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingEscalas ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : escalasDoMes && escalasDoMes.length > 0 ? (
                <div className="space-y-4">
                  <AnimatePresence>
                    {escalasDoMes
                      .sort((a, b) => {
                        try {
                          const dataA = extrairDataEscala(a);
                          const dataB = extrairDataEscala(b);

                          if (!dataA || !dataB) return 0;

                          return parseISO(dataA).getTime() - parseISO(dataB).getTime();
                        } catch (e) {
                          return 0;
                        }
                      })
                      .map((escala) => {
                        let dataFormatada = 'Data inválida';
                        try {
                          // Usar função helper que tenta data primeiro, depois dias
                          const dataStr = extrairDataEscala(escala);
                          if (dataStr) {
                            dataFormatada = format(parseISO(dataStr), "EEEE, d 'de' MMMM", {
                              locale: ptBR,
                            });
                          }
                        } catch (e) {
                          console.error('Erro ao formatar data da escala:', e);
                        }

                        return (
                        <motion.div
                          key={escala.id}
                          variants={itemVariants}
                          layout
                          exit={{ opacity: 0, x: -20 }}
                          className="p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors group"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-foreground">
                                {dataFormatada}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {escala.voluntarios?.length || 0} voluntários
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
                                <DropdownMenuItem
                                  onClick={() => {
                                    try {
                                      const dataStr = extrairDataEscala(escala);
                                      if (dataStr) {
                                        handleOpenDialog(parseISO(dataStr), escala);
                                      } else {
                                        console.warn('Escala sem data para editar');
                                      }
                                    } catch (e) {
                                      console.error('Erro ao abrir edição:', e);
                                    }
                                  }}
                                >
                                  <Pencil className="w-4 h-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedEscala(escala);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Remover
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {escala.voluntarios?.map((v) => (
                              <div
                                key={v.id}
                                className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-full text-sm"
                              >
                                <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-medium">
                                  {v.nome.charAt(0)}
                                </div>
                                <span className="text-foreground">{v.nome}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                        );
                      })
                    }
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-12">
                  <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Nenhuma escala neste mês
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Crie uma nova escala para organizar os voluntários
                  </p>
                  <Button
                    onClick={() => handleOpenDialog(new Date())}
                    className="gradient-primary text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Escala
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedEscala ? 'Editar Escala' : 'Nova Escala'}
            </DialogTitle>
            <DialogDescription>
              {selectedDate && (
                <span className="font-medium text-foreground">
                  {format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="py-4">
              <Label className="mb-3 block">Selecione os voluntários</Label>
              <ScrollArea className="h-64 border rounded-lg p-3">
                {loadingVoluntarios ? (
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-10 bg-muted rounded animate-pulse" />
                    ))}
                  </div>
                ) : voluntarios && voluntarios.length > 0 ? (
                  <div className="space-y-2">
                    {voluntarios
                      .filter((v) => v.ativo)
                      .map((voluntario) => (
                        <div
                          key={voluntario.id}
                          className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                            selectedVoluntariosIds.includes(voluntario.id)
                              ? 'bg-primary/10'
                              : 'hover:bg-muted'
                          }`}
                          onClick={() => toggleVoluntario(voluntario.id)}
                        >
                          <Checkbox
                            checked={selectedVoluntariosIds.includes(voluntario.id)}
                            onCheckedChange={() => toggleVoluntario(voluntario.id)}
                          />
                          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-white text-sm font-medium">
                            {voluntario.nome.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm text-foreground">
                              {voluntario.nome}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {voluntario.email}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    Nenhum voluntário disponível
                  </p>
                )}
              </ScrollArea>
              <p className="text-sm text-muted-foreground mt-2">
                {selectedVoluntariosIds.length} voluntário(s) selecionado(s)
              </p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                className="gradient-primary text-white"
                disabled={
                  criarEscala.isPending ||
                  atualizarEscala.isPending ||
                  selectedVoluntariosIds.length === 0
                }
              >
                {criarEscala.isPending || atualizarEscala.isPending
                  ? 'Salvando...'
                  : selectedEscala
                  ? 'Atualizar'
                  : 'Criar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover Escala</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja remover a escala de{' '}
                <strong>
                  {selectedEscala && (
                    (() => {
                      try {
                        const dataStr = extrairDataEscala(selectedEscala);
                        if (dataStr) {
                          return format(parseISO(dataStr), "d 'de' MMMM", { locale: ptBR });
                        }
                        return 'Data inválida';
                      } catch (e) {
                        console.error('Erro ao formatar data para deleção:', e);
                        return 'Data inválida';
                      }
                    })()
                  )}
                </strong>
                ? Esta ação não pode ser desfeita.
              </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deletarEscala.isPending}
            >
              {deletarEscala.isPending ? 'Removendo...' : 'Remover'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
