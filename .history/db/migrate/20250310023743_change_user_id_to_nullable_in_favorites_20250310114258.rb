class ChangeUserIdToNullableInFavorites < ActiveRecord::Migration[6.0]
  def change
    # `user_id` を null 許可にする
    change_column_null :favorites, :user_id, true
  end
end
