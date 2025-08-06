package com.code2care.donor.infrastructure.adapters;

import com.code2care.common.domain.model.DonorDto;
import com.code2care.common.infrastructure.entites.Donor;
import com.code2care.donor.application.dto.DashboardStatsDto;
import com.code2care.donor.domain.repository.DonorRepository;
import com.code2care.donor.infrastructure.repository.DonorJpaBloodUnitRepository;
import com.code2care.donor.infrastructure.repository.JpaDonorRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.time.LocalDate;

@Repository
public class DonorRepositoryImpl implements DonorRepository {
    private final JpaDonorRepository jpaDonorRepository;
    private final DonorJpaBloodUnitRepository jpaBloodUnitRepository;
    private final ModelMapper modelMapper;

    public DonorRepositoryImpl(JpaDonorRepository jpaDonorRepository, DonorJpaBloodUnitRepository jpaBloodUnitRepository, @Qualifier("donorModelMapper") ModelMapper modelMapper) {
        this.jpaDonorRepository = jpaDonorRepository;
        this.jpaBloodUnitRepository = jpaBloodUnitRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public void save(DonorDto donorDto) {
        jpaDonorRepository.save(modelMapper.map(donorDto, Donor.class));
    }

    @Override
    public Page<DonorDto> filterDonor(String bloodType, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        return jpaDonorRepository.findAllByBloodTypeContainingOrLastDonationDateBetween(bloodType, startDate, endDate, pageable).map((element) -> modelMapper.map(element, DonorDto.class));
    }

    @Override
    public Page<DonorDto> searchDonor(String searchTerm, Pageable pageable) {
        return jpaDonorRepository.findAllByFullNameContainingIgnoreCaseOrBloodTypeContainingIgnoreCaseOrAddressContainingIgnoreCase(searchTerm, searchTerm, searchTerm, pageable).map((element) -> modelMapper.map(element, DonorDto.class));
    }

    @Override
    public DashboardStatsDto getDashboardStats() {
        long totalDonors = jpaDonorRepository.count();
        long eligibleNow = jpaDonorRepository.countByLastDonationDateBefore(LocalDate.now().minusMonths(2));
        long totalDonations = jpaBloodUnitRepository.count();
        long donationsThisMonth = jpaBloodUnitRepository.countByExpirationDateBefore(Instant.now());

        return new DashboardStatsDto(totalDonors, eligibleNow, totalDonations, donationsThisMonth);
    }
}
