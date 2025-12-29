package com.skapp.community.common.service;

import com.skapp.community.common.payload.request.*;
import com.skapp.community.common.payload.response.ResponseEntityDto;

public interface AuthService {

	ResponseEntityDto signIn(SignInRequestDto signInRequestDto);

	ResponseEntityDto superAdminSignUp(SuperAdminSignUpRequestDto superAdminSignUpRequestDto);

	ResponseEntityDto refreshAccessToken(RefreshTokenRequestDto refreshTokenRequestDto);

	ResponseEntityDto employeeResetPassword(ResetPasswordRequestDto resetPasswordRequestDto);

	ResponseEntityDto sharePassword(Long userId);

	ResponseEntityDto resetAndSharePassword(Long userId);

	ResponseEntityDto sendReInvitation(ReInvitationRequestDto reInvitationRequestDto);

	ResponseEntityDto forgotPassword(ForgotPasswordRequestDto forgotPasswordRequestDto);

	ResponseEntityDto changePassword(ChangePasswordRequestDto changePasswordRequestDto, Long userId);

}
