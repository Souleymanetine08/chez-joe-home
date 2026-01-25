import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { useOrders } from "@/hooks/useOrders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, FolderTree, ShoppingCart, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function StatCard({
  title,
  value,
  icon: Icon,
  description,
  isLoading,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  isLoading?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-20" />
        ) : (
          <div className="text-2xl font-bold text-foreground">{value}</div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-SN", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
  }).format(price);
}

export default function Dashboard() {
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: orders, isLoading: ordersLoading } = useOrders();

  const totalProducts = products?.length || 0;
  const inStockProducts = products?.filter((p) => p.in_stock).length || 0;
  const totalCategories = categories?.length || 0;
  const totalOrders = orders?.length || 0;
  const pendingOrders = orders?.filter((o) => o.status === "pending").length || 0;
  const confirmedOrders = orders?.filter((o) => o.status === "confirmed").length || 0;
  const deliveredOrders = orders?.filter((o) => o.status === "delivered").length || 0;
  const totalRevenue = orders
    ?.filter((o) => o.status === "delivered")
    .reduce((sum, o) => sum + o.total, 0) || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">
          Tableau de bord
        </h1>
        <p className="text-muted-foreground mt-1">
          Vue d'ensemble de votre boutique
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Produits"
          value={totalProducts}
          icon={Package}
          description={`${inStockProducts} en stock`}
          isLoading={productsLoading}
        />
        <StatCard
          title="Catégories"
          value={totalCategories}
          icon={FolderTree}
          isLoading={categoriesLoading}
        />
        <StatCard
          title="Commandes"
          value={totalOrders}
          icon={ShoppingCart}
          description={`${pendingOrders} en attente`}
          isLoading={ordersLoading}
        />
        <StatCard
          title="Revenu Total"
          value={formatPrice(totalRevenue)}
          icon={TrendingUp}
          description="Commandes livrées"
          isLoading={ordersLoading}
        />
      </div>

      {/* Order Status Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Clock className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="text-2xl font-bold">{pendingOrders}</div>
            )}
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Confirmées</CardTitle>
            <ShoppingCart className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="text-2xl font-bold">{confirmedOrders}</div>
            )}
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Livrées</CardTitle>
            <CheckCircle className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <Skeleton className="h-8 w-12" />
            ) : (
              <div className="text-2xl font-bold">{deliveredOrders}</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Commandes Récentes</CardTitle>
        </CardHeader>
        <CardContent>
          {ordersLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : orders && orders.length > 0 ? (
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {order.customer_name || "Client anonyme"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.customer_phone || "Pas de téléphone"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">
                      {formatPrice(order.total)}
                    </p>
                    <span
                      className={`inline-block px-2 py-0.5 text-xs rounded-full ${
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "confirmed"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status === "pending"
                        ? "En attente"
                        : order.status === "confirmed"
                        ? "Confirmée"
                        : order.status === "delivered"
                        ? "Livrée"
                        : "Annulée"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Aucune commande pour le moment
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
