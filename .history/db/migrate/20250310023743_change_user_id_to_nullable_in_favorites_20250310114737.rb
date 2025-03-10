class ChangeUserIdToNullableInFavorites < ActiveRecord::Migration[6.0]
  def change
    remove_column :favorites, :user_id
  end
end