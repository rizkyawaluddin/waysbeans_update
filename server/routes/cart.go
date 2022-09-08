package routes

import (
	"waysbeans_be/handlers"
	"waysbeans_be/pkg/middleware"
	"waysbeans_be/pkg/mysql"
	"waysbeans_be/repositories"

	"github.com/gorilla/mux"
)

func CartRoutes(r *mux.Router) {
	cartRepository := repositories.RepositoryCart(mysql.DB)
	h := handlers.HandlerCart(cartRepository)

	r.HandleFunc("/cart", middleware.Auth(h.CreateCart)).Methods("POST")
	r.HandleFunc("/carts-id", middleware.Auth(h.FindCartId)).Methods("GET")
	r.HandleFunc("/cart/{id}", h.UpdateCartQty).Methods("PATCH")
	r.HandleFunc("/carttrans/{id}", h.UpdateCartTrans).Methods("PATCH")
}
