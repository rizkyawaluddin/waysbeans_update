package models

type Product struct {
	ID     int    `json:"id" gorm:"primary_key:auto_increment"`
	Name   string `json:"name" form:"name" gorm:"type: varchar(255)"`
	Desc   string `json:"desc" gorm:"type:text" form:"desc"`
	Price  int    `json:"price" form:"price" gorm:"type: int"`
	Image  string `json:"image" form:"image" gorm:"type: varchar(255)"`
	Stock  int    `json:"stock" form:"stock"`
	UserID int    `json:"-" form:"user_id"`
}

type ProductResponse struct {
	ID     int    `json:"id"`
	Name   string `json:"name"`
	Desc   string `json:"desc"`
	Price  int    `json:"price"`
	Image  string `json:"image"`
	Stock  int    `json:"stock"`
	UserID int    `json:"-"`
}

type ProductTransaction struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Price int    `json:"price"`
	Image string `json:"image"`
}

func (ProductResponse) TableName() string {
	return "products"
}

func (ProductTransaction) TableName() string {
	return "products"
}
