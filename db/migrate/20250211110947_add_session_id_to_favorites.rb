class AddSessionIdToFavorites < ActiveRecord::Migration[6.1]
  def change
    add_column :favorites, :session_id, :string, null: false
    add_index :favorites, [:video_id, :session_id], unique: true # 重複登録を防ぐ
  end
end