class User < ApplicationRecord
  has_many :favorites, dependent: :destroy
  has_many :liked_videos, through: :favorites, source: :video
end
