class AddSessionIdToFavorites < ActiveRecord::Migration[7.1]
  def change
    add_column :favorites, :session_id, :string
  end
end
