class ApplicationController < ActionController::API
    # protect_from_forgery with: :exception
    # skip_before_action :verify_authenticity_token

    # after_action :set_access_control_headers

    # def set_access_control_headers
    #   headers['Access-Control-Allow-Origin'] = '*'
    # end

end
