class Expense < ApplicationRecord
  belongs_to :category
  validates :amount, numericality: { greater_than: 0 }
end
