class FavoritesController < ApplicationController
  belongs_to :video
  validates :session_id, presence: true
end