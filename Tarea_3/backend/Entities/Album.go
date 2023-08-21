package Entities

import (
    "gorm.io/gorm"
    "github.com/go-playground/validator/v10"
)

type Album_collection struct {
    gorm.Model
    ID     int    `gorm:"primaryKey"`
    Title  string
    Artist string
    Year   string
    Genre  string
}

type CreateAlbumSchema struct {
	Title     string `json:"title" validate:"required"`
	Artist string `json:"artist" validate:"required"`
	Year  string `json:"year,required"`
	Genre string   `json:"genre,required"`
}

var validate = validator.New()

type ErrorResponse struct {
	Field string `json:"field"`
	Tag   string `json:"tag"`
	Value string `json:"value,omitempty"`
}

func ValidateStruct[T any](payload T) []*ErrorResponse {
	var errors []*ErrorResponse
	err := validate.Struct(payload)
	if err != nil {
		for _, err := range err.(validator.ValidationErrors) {
			var element ErrorResponse
			element.Field = err.StructNamespace()
			element.Tag = err.Tag()
			element.Value = err.Param()
			errors = append(errors, &element)
		}
	}
	return errors
}