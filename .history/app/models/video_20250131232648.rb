# app/models/video.rb
class Video < ApplicationRecord
  has_one_attached :excel_file
end