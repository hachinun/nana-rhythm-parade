class Favorite < ApplicationRecord
  belongs_to :video
  validates :session_id, presence: true
  validates :video_id, uniqueness: { scope: :session_id } # 同じ動画を複数回お気に入り登録しない
end
