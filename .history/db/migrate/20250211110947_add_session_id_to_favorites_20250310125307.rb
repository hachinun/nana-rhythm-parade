class AddSessionIdToFavorites < ActiveRecord::Migration[6.1]
  def change
    unless column_exists?(:favorites, :session_id)
      add_column :favorites, :session_id, :string, null: false
      add_index :favorites, [:video_id, :session_id], unique: true
    end
  end
end
