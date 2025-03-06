# app/controllers/application_controller.rb など
before_action :set_session_id

def set_session_id
  Rails.logger.debug "Current session_id: #{session[:session_id]}"
  # セッションIDがnilの場合、生成して保存
  session[:session_id] ||= SecureRandom.uuid
end
