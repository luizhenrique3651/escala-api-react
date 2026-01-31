import { motion } from 'framer-motion';
import { Users, Calendar, TrendingUp, Heart, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useVoluntarios } from '@/hooks/useVoluntarios';
import { useEscalas } from '@/hooks/useEscalas';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { data: voluntarios, isLoading: loadingVoluntarios } = useVoluntarios();
  const { data: escalas, isLoading: loadingEscalas } = useEscalas();

  const hoje = new Date();
  const proximasEscalas = escalas
    ?.filter((escala) => isAfter(parseISO(escala.data), hoje))
    .sort((a, b) => parseISO(a.data).getTime() - parseISO(b.data).getTime())
    .slice(0, 3);

  const totalVoluntarios = voluntarios?.length || 0;
  const totalEscalas = escalas?.length || 0;
  const voluntariosAtivos = voluntarios?.filter((v) => v.ativo).length || 0;

  const stats = [
    {
      title: 'Voluntários',
      value: totalVoluntarios,
      description: `${voluntariosAtivos} ativos`,
      icon: Users,
      color: 'primary',
      gradient: 'from-primary to-primary/80',
    },
    {
      title: 'Escalas',
      value: totalEscalas,
      description: 'Total registrado',
      icon: Calendar,
      color: 'secondary',
      gradient: 'from-secondary to-secondary/80',
    },
    {
      title: 'Taxa de Participação',
      value: '87%',
      description: 'Este mês',
      icon: TrendingUp,
      color: 'success',
      gradient: 'from-success to-success/80',
    },
    {
      title: 'Impacto',
      value: '+200',
      description: 'Crianças beneficiadas',
      icon: Heart,
      color: 'accent',
      gradient: 'from-accent to-accent/80',
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Visão geral do sistema de escalas
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
          <motion.div key={stat.title} variants={itemVariants}>
            <Card className="card-elevated overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-foreground mt-1">
                      {loadingVoluntarios || loadingEscalas ? '...' : stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.description}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximas Escalas */}
        <motion.div variants={itemVariants}>
          <Card className="card-elevated h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold">
                Próximas Escalas
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/escalas')}
                className="text-primary hover:text-primary/80"
              >
                Ver todas
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingEscalas ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : proximasEscalas && proximasEscalas.length > 0 ? (
                proximasEscalas.map((escala) => (
                  <div
                    key={escala.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {format(parseISO(escala.data), "EEEE, d 'de' MMMM", {
                          locale: ptBR,
                        })}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {escala.voluntarios?.length || 0} voluntários escalados
                      </p>
                    </div>
                    <div className="flex -space-x-2">
                      {escala.voluntarios?.slice(0, 4).map((v, i) => (
                        <div
                          key={v.id}
                          className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs font-medium text-primary"
                        >
                          {v.nome.charAt(0)}
                        </div>
                      ))}
                      {(escala.voluntarios?.length || 0) > 4 && (
                        <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium text-muted-foreground">
                          +{(escala.voluntarios?.length || 0) - 4}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhuma escala próxima</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Voluntários Recentes */}
        <motion.div variants={itemVariants}>
          <Card className="card-elevated h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg font-semibold">
                Voluntários
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/voluntarios')}
                className="text-primary hover:text-primary/80"
              >
                Ver todos
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {loadingVoluntarios ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : voluntarios && voluntarios.length > 0 ? (
                voluntarios.slice(0, 5).map((voluntario) => (
                  <div
                    key={voluntario.id}
                    className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-medium">
                      {voluntario.nome.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">
                        {voluntario.nome}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {voluntario.email}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        voluntario.ativo
                          ? 'bg-success/20 text-success'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {voluntario.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhum voluntário cadastrado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
