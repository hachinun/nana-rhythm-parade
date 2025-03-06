class ChangeUserIdInFavorites < ActiveRecord::Migration[6.0]
  def change
    change_column_null :favorites, :user_id, true
  end
end
