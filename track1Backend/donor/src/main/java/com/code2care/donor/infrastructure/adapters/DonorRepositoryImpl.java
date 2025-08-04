package com.code2care.donor.infrastructure.adapters;

import com.code2care.common.domain.model.DonorDto;
import com.code2care.common.infrastructure.entites.Donor;
import com.code2care.donor.domain.repository.DonorRepository;
import com.code2care.donor.infrastructure.repository.JpaDonorRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
@RequiredArgsConstructor
public class DonorRepositoryImpl implements DonorRepository {
    private final JpaDonorRepository jpaDonorRepository;
    private final ModelMapper modelMapper;

    @Override
    public void save(DonorDto donorDto) {
        jpaDonorRepository.save(modelMapper.map(donorDto, Donor.class));
    }

    @Override
    public Page<DonorDto> searchDonor(String fullName, String bloodType, String address, Pageable pageable) {
        return jpaDonorRepository.findAllByFullNameOrBloodTypeOrAddress(fullName, bloodType, address, pageable).map((element) -> modelMapper.map(element, DonorDto.class));
    }
}
